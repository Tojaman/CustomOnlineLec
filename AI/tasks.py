from celery import Celery
import os, boto3, jsonify, subprocess, re
from dotenv import load_dotenv
from moviepy.editor import VideoFileClip, AudioFileClip


load_dotenv()

AWS_DEFAULT_REGION = os.environ.get('AWS_DEFAULT_REGION')
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
S3_BUCKET = os.environ.get('S3_BUCKET')

celery = Celery('FlaskAiModelServing', broker='redis://127.0.0.1:6379/0', backend='redis://127.0.0.1:6379/0')


@celery.task
def process_uploaded_file(convert_voice_path, local_video_path, local_audio_path, RVC_model):

    result = []

    # s3 연결 및 객체 생성
    s3 = s3_connection()

    # RVC 변환(return 변환 음성 저장 경로)
    # convert_voice_path = execute_voice_conversion(RVC_model, local_audio_path)
    convert_voice_dir = local_audio_path

    # 원본 영상 + 변환 음성
    convert_video_path = merge_video_audio(convert_voice_path, local_video_path, convert_voice_dir)
    # convert_video_path = local_video_path

    # 최종 변환 파일 이름 추출
    convert_video_name = os.path.basename(convert_video_path)

    # s3 업로드
    convert_video_path_s3 = "convert_voice/" + convert_video_name # 저장할 S3 경로
    if s3_put_object(s3, S3_BUCKET, convert_video_path, convert_video_path_s3):
        result.append("파일 업로드 성공")
    else:
        result.append("파일 업로드 실패")


    # 음성 변환 영상 s3 경로 return
    return convert_video_path_s3


# 원본 영상 + 변환 음성
@celery.task
def merge_video_audio(convert_voice_path, video_path, audio_path):
    video_clip = VideoFileClip(video_path)
    audio_clip = AudioFileClip(audio_path)

    # 영상에 음성 추가
    video_clip = video_clip.set_audio(audio_clip)

    # 파일명 추출
    file_name = os.path.splitext(os.path.basename(video_path))[0]  # splitext : 파일의 확장자를 분리해서 저장하기 위함

    # 최종 영상 저장 경로 설정
    output_path = os.path.join(convert_voice_path, f'{file_name}_video.mp4')

    # 새로운 파일로 저장(.mp4)
    video_clip.write_videofile(output_path, codec="libx264", audio_codec="aac", ffmpeg_params=["-preset", "ultrafast"])

    return output_path


# S3 연결 및 S3 객체 반환
@celery.task
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


# S3에 파일 업로드
@celery.task
def s3_put_object(s3, bucket, local_filepath, s3_filepath):

    try:
        s3.upload_file(local_filepath, bucket, s3_filepath)
        print("s3 file upload")
    except Exception as e:
        print(e)
        return False
    return True


@celery.task
def execute_voice_conversion(model_name, local_file_dir):
    # 설정값을 사용하여 명령어 생성
    command = [
        "python3",
        "RVC_custom/src/main.py",
        "-i", local_file_dir,
        "-dir", model_name,
        "-p", "0",
        "-pall", "0",
        "-ir", "0.75",
        "-fr", "3",
        "-rms", "0.25",
        "-palgo", "rmvpe",
        "-hop", "64",
        "-pro", "0.33",
        "-mv", "0",
        "-bv", "0",
        "-iv", "0",
        "-rsize", "0.15",
        "-rwet", "0.2",
        "-rdry", "0.8",
        "-rdamp", "0.7",
        "-oformat", "wav"
    ]
    # 명령어 실행
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True)
    # 명령어 실행 결과 반환
    # output = ""
    cover_path = ""
    for line in process.stdout:
        # 정규식을 사용하여 파일 경로 추출
        match = re.search(r'Cover generated at (.+)', line)
        if match:
            cover_path = match.group(1).strip()

    process.wait()

    return cover_path
