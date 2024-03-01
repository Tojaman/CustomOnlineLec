from flask import Flask, request, jsonify
from tasks import process_uploaded_file, stt
from DB.config import DB
from DB.connection import get_connection
from dao.dao import VideoDao
import os, tempfile, boto3, shutil, time, tempfile
from datetime import datetime
from celery import group

# import whisper

# swagger
from flask_restx import Api, Resource, fields
from dotenv import load_dotenv
from moviepy.editor import VideoFileClip, AudioFileClip


app = Flask(__name__)

load_dotenv()

AWS_DEFAULT_REGION = os.environ.get('AWS_DEFAULT_REGION')
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
S3_BUCKET = os.environ.get('S3_BUCKET')

# DAO 객체 생성
video_dao = VideoDao()

# swagger
api = Api(app, version='1.0', title='Flask API 문서', description='Swagger 문서', doc="/api-docs")

# 네임스페이스 생성과 동시에 등록(flask_restx)
ai_serving_api = api.namespace('convert', description='음성 변환 API')

upload_model = api.model('UploadModel', {
    'video_id': fields.Integer(required=True, description='사용자 ID', help='사용자 ID는 필수'),
    'url': fields.String(required=True, description='S3 경로', help='S3 경로는 필수'),
    'RVC_model': fields.String(required=True, description='rvc 모델 이름', help='모델 이름은 필수')
})

@ai_serving_api.route('')
class ConvertVoice(Resource):
    @ai_serving_api.expect(upload_model)
    def post(self):
        # 임시 폴더 생성
        # with tempfile.TemporaryDirectory() as temp_dir:
        try:
            user_id = request.json['userId']
            original_video_s3_path = request.json['url']
            
            dir_path = "./files/"

            # s3 연결 및 객체 생성
            s3 = s3_connection()

            # 원본 영상 파일명 추출
            original_filename = os.path.basename(original_video_s3_path)

            # 원본 영상을 저장할 경로 설정
            local_video_path = os.path.join(dir_path, original_filename)

            # 원본 영상 다운로드
            if not s3_get_object(s3, S3_BUCKET, original_video_s3_path, local_video_path):
                print("파일 다운 실패")
            
            print("원본 동영상", local_video_path)

            # 음성 추출
            local_audio_path = extract_audio(dir_path, local_video_path)
            print("추출 음성 경로", local_audio_path)

            # 모델 목록
            model_list = ["yoon", "jimin", "timcook", "karina"]
            # model_list = ["yoon"]
            results = {}  # 각 모델의 결과를 저장할 딕셔너리
            rvc_result = ""
            stt_result = ""

            # STT 실행(비동기)
            # subtitle = stt().delay(local_audio_path)

            # RVC 변환(비동기)
            for model in model_list:
                results[model] = process_uploaded_file.delay(dir_path, local_video_path, local_audio_path, model)

            # while not subtitle.ready() and not all(result.ready() for result in results.values()):
            while not all(result.ready() for result in results.values()):
                print("변환중...")
                time.sleep(1)
            
            # subtitle = subtitle.get()
            # if subtitle['success']:
            #     subtitle_result = subtitle['data']
            #     stt_result = "자막 추출 성공"
            # else :
            #     stt_result = "자막 추출 실패"

            # 일단 하나라도 실패하면 False 반환
            # 작업이 완료되면 결과를 저장
            for model, result in results.items():
                actual_result = result.get()
                # RVC 변환 성공
                if actual_result['success']:
                    results[model] = actual_result['data']
                    rvc_result = "음성 변환 완료"
                # RVC 변환 실패
                else:
                    rvc_result = "음성 변환 실패"

            # DB 업로드
            connection = get_connection(DB)
            video_id = video_dao.upload_convert_s3_path(connection, user_id, original_video_s3_path, results)
            connection.close()
            
            DeleteAllFiles(dir_path)

            # JSON 형식 자막, s3 경로 저장한 테이블 기본키 HTTP body에 넣어서 프론트에 return
            response_data = {
                'video_id': video_id,
                # 'stt_result': stt_result, # 자막 변환 성공 여부 반환
                'rvc_result': rvc_result # RVC 실패한 모델 변환
            }

            # HTTP 응답 생성
            response = jsonify(response_data)
            response.status_code = 200  # 성공적인 요청을 나타내는 HTTP 상태 코드

            # 응답 반환
            return response

        except ValueError:
            DeleteAllFiles(dir_path)
            # 잘못된 요청일 경우 HTTP 상태 코드 400 반환
            return {'error': 'Bad Request'}, 400

        except Exception as e:
            DeleteAllFiles(dir_path)
            # 서버에서 오류가 발생한 경우 HTTP 상태 코드 500과 오류 메시지 반환
            return {'error': str(e)}, 500

# S3에서 파일 다운로드
def s3_get_object(s3, bucket, s3_filepath, local_filepath):
    try:
        s3.download_file(bucket, s3_filepath, local_filepath)
        print("s3 file download")
        return True
    except Exception as e:
        print(e)
        return False
    
# S3 연결 및 S3 객체 반환
def s3_connection():
    try:
        s3 = boto3.client(
            service_name='s3',
            region_name=AWS_DEFAULT_REGION,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY
        )
        print("S3 bucket connected!")
        return s3
    except Exception as e:
        print(e)
        raise

def extract_audio(dir_path, file_path):
    # 동영상 파일 로드
    video_clip = VideoFileClip(file_path)

    # 오디오 추출
    audio_clip = video_clip.audio

    # 파일명 추출
    file_name = os.path.splitext(os.path.basename(file_path))[0] # splitext : 파일의 확장자를 분리해서 저장하기 위함

    # 오피오 파일 경로 설정
    output_audio_path = os.path.join(dir_path, f'{file_name}_extract_audio.wav')

    # 오디오를 WAV 파일로 저장
    audio_clip.write_audiofile(output_audio_path, codec='pcm_s16le', fps=audio_clip.fps)

    # 메모리에서 오디오 클립 제거
    audio_clip.close()

    return output_audio_path

def DeleteAllFiles(filePath):
    if os.path.exists(filePath):
        for file in os.scandir(filePath):
            os.remove(file.path)
        # return 'Remove All File'
    # else:
        # return 'Directory Not Found'


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)