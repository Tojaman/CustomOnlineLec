import pymysql, os

class VideoDao:

    def upload_convert_s3_path(self, connection, userId, originalS3Path, convert_s3_path):
        cursor = connection.cursor()
        cursor.execute('INSERT INTO videos (userId, originalS3Path) VALUES (%s, %s)', (userId, originalS3Path))
        video_id = cursor.lastrowid  # 기본 키 값을 반환
        cursor.execute('INSERT INTO convertVideos (yoon, jimin, timcook, karina) VALUES (%s, %s, %s, %s)', (convert_s3_path["yoon"], convert_s3_path["jimin"], convert_s3_path["timcook"], convert_s3_path["karina"]))
        convert_video_id = cursor.lastrowid  # 기본 키 값을 반환
        cursor.execute('UPDATE videos SET convertVideosId=%s where id=%s', (convert_video_id, video_id))

        connection.commit()
        cursor.close()
        return video_id

        # # convert_s3_path 값 저장 및 기본키 반환
        # def update_video_s3_path(self, connection, date, userId, originalS3Path):
        #     cursor = connection.cursor()
        #     cursor.execute('INSERT INTO videos (date, userId, originalS3Path) VALUES (%s, %s, %s)',
        #                    (date, userId, originalS3Path))
        #     connection.commit()
        #     video_id = cursor.lastrowid  # 기본 키 값을 반환
        #     cursor.close()
        #     return video_id
        #
        # # 자막 및 음성 변환 영상 s3 경로를 한번에 업데이트
        # # subtitle : 리스트, convert_s3_path : 딕셔너리
        # def upload_subtitle_onvert_s3_path(self, connection, video_id, subtitle, convert_s3_path):
        #     cursor = connection.cursor()
        #     cursor.execute('UPDATE convertVideos SET yoon=%s, jimin=%s, timcook=%s, Karina=%s WHERE id=%s', (
        #     convert_s3_path["yoon"], convert_s3_path["jimin"], convert_s3_path["timcook"], convert_s3_path["Karina"],
        #     video_id))
        #     cursor.execute('UPDATE Videos SET subtitle=%s WHERE id=%s', (subtitle, video_id))
        #     connection.commit()
        #     cursor.close()


    # video_id에 해당하는 레코드(행)의 original_path를 삭제
    # def delete_original_video_s3_path(self, connection, video_id):
    #     cursor = connection.cursor()
    #     cursor.execute('UPDATE videos SET original_s3_path = NULL WHERE id = %s', video_id)
    #     connection.commit()
    #     cursor.close()



    # def add_convert_s3_path(self, connection, video_id, convertS3Path, rvc_model):
    #     cursor = connection.cursor()
    #
    #     # Check if the video_id exists in videos table
    #     cursor.execute('SELECT id FROM videos WHERE id = %s', (video_id,))
    #     video_record = cursor.fetchone()
    #     if video_record:
    #         # Insert new record into convertVideos table without specifying the id field
    #         if rvc_model == "윤석열" :
    #             cursor.execute('INSERT INTO convertVideos (yoon) VALUES (%s)', (convertS3Path,))
    #             connection.commit()
    #         elif rvc_model == "jimin700":
    #             cursor.execute('INSERT INTO convertVideos (jimin) VALUES (%s)', (convertS3Path,))
    #             connection.commit()
    #         elif rvc_model == "timcook":
    #             cursor.execute('INSERT INTO convertVideos (timcook) VALUES (%s)', (convertS3Path,))
    #             connection.commit()
    #         else:
    #             cursor.execute('INSERT INTO convertVideos (Karina) VALUES (%s)', (convertS3Path,))
    #             connection.commit()
    #
    #         # cursor.execute('INSERT INTO convertVideos () VALUES (%s)', (convertS3Path,))
    #         # connection.commit()
    #
    #         # Get the last inserted id from convert_videos table
    #         convertVideosId = cursor.lastrowid
    #         # Update foreign key in videos table
    #         cursor.execute('UPDATE videos SET convertVideosId = %s WHERE id = %s',
    #                        (convertVideosId, video_id))
    #         connection.commit()
    #         cursor.close()
    #         return True
    #     else:
    #         cursor.close()
    #         return False