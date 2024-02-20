from flask import Flask, request, jsonify
from tasks import process_uploaded_file
from DB.config import DB
from DB.connection import get_connection
from dao.dao import VideoDao
import os, tempfile, boto3, shutil
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
        """
        body 메시지 예시
        {
            "url": "original_video/ojtube.wav",
            "RVC_model": "Elonmusk"
        }
        """
        try:
            json_data = request.json
            print(json_data)
            user_id = request.json['userId']
            original_video_s3_path = request.json['url']
            # RVC_model = "te"
            #RVC_model = request.json['rvcModel']


            # s3 연결 및 객체 생성
            s3 = s3_connection()

            original_video_path = "./original_video/"
            extract_voice_path = "./extract_voice/"
            convert_video_dir = "./convert_video/"

            # 원본 영상 파일명 추출
            original_filename = os.path.basename(original_video_s3_path)

            # 원본 영상을 저장할 경로 설정
            local_video_path = os.path.join(original_video_path, original_filename)


            # 원본 영상 다운로드
            if s3_get_object(s3, S3_BUCKET, original_video_s3_path, local_video_path):
                print("파일 다운 성공")
            else:
                print("파일 다운 실패")

            # 음성 추출
            local_audio_path = extract_audio(extract_voice_path, local_video_path)

            # 자막 추출(Flask 동기)
            # Whisper STT로 문장 단위 JSON 형식 자막
            # subtitle = stt(local_audio_path)


            # DB와 연결
            connection = get_connection(DB)

            # 현재 시간을 가져옵니다.
            current_time = datetime.now()

            # DATE 형식에 맞게 변환합니다.
            date = current_time.strftime('%Y-%m-%d')

            # DB에 convert_file_path_s3 저장
            video_id = video_dao.update_video_s3_path(connection, date, user_id, original_video_s3_path)
            print("DB 저장 완료")
            # RVC 음성 변환(celery 비동기)
            RVC_model = "Karina_V2"
            process_uploaded_file.delay(convert_video_dir, local_video_path, local_audio_path, RVC_model, video_id).get()
            tmp1 = "jimin700"
            tmp2 = "윤석열"
            tmp3 = "timcook"
            
            process_uploaded_file.delay(convert_video_dir, local_video_path, local_audio_path, tmp1, video_id)
            process_uploaded_file.delay(convert_video_dir, local_video_path, local_audio_path, tmp2, video_id)
            process_uploaded_file.delay(convert_video_dir, local_video_path, local_audio_path, tmp3, video_id)
            # 모델 목록
            # model_list = ["jimin700", "timcook", "Elonmusk", "윤석열"]
            #model_list = ["jimin700", "timcook", "Karina_V2", "윤석열"]


            # 모든 모델을 동시에 처리
            #tasks_group = group(
                #process_uploaded_file.s(convert_video_dir, local_video_path, local_audio_path, model, video_id) for model in model_list)
            #tasks.delay()
            # 작업 그룹을 비동기적으로 실행
            #result_group = tasks_group.delay()

            # 작업이 완료될 때까지 대기
            #while not result_group.ready():
                #time.sleep(1)  # 작업이 완료되지 않았으면 1초 대기

            # DB와 연결 해제
            connection.close()

            # JSON 형식 자막, s3 경로 저장한 테이블 기본키 HTTP body에 넣어서 프론트에 return
            response_data = {
                'video_id': video_id,
                # 'subtitle': subtitle
            }

            # HTTP 응답 생성
            response = jsonify(response_data)
            response.status_code = 200  # 성공적인 요청을 나타내는 HTTP 상태 코드

            # 응답 반환
            return response


        except ValueError:
            # 잘못된 요청일 경우 HTTP 상태 코드 400 반환
            return {'error': 'Bad Request'}, 400

        except Exception as e:
            # 서버에서 오류가 발생한 경우 HTTP 상태 코드 500과 오류 메시지 반환
            return {'error': str(e)}, 500


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


# S3에서 파일 다운로드
def s3_get_object(s3, bucket, s3_filepath, local_filepath):

    try:
        s3.download_file(bucket, s3_filepath, local_filepath)
        print("s3 file download")
        return True
    except Exception as e:
        print(e)
        return False

def extract_audio(temp_dir, file_path):
    # 동영상 파일 로드
    video_clip = VideoFileClip(file_path)

    # 오디오 추출
    audio_clip = video_clip.audio

    # 파일명 추출
    file_name = os.path.splitext(os.path.basename(file_path))[0] # splitext : 파일의 확장자를 분리해서 저장하기 위함

    # 오피오 파일 경로 설정
    output_audio_path = os.path.join(temp_dir, f'{file_name}_audio.wav')

    # 오디오를 WAV 파일로 저장
    audio_clip.write_audiofile(output_audio_path, codec='pcm_s16le', fps=audio_clip.fps)

    # 메모리에서 오디오 클립 제거
    audio_clip.close()

    return output_audio_path


def stt(local_audio_path):
    model = whisper.load_model("medium")
    sentence_result = model.transcribe(local_audio_path)
    sentencelevel_info = []

    # Whisper로 추출한 text에서 문장과 timestamp만 추출
    for each in sentence_result['segments'][1:]:
        # print (word['word'], "  ",word['start']," - ",word['end'])
        sentencelevel_info.append({'text': each['text'], 'start': each['start'], 'end': each['end']})

    return sentencelevel_info


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
