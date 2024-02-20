package com.example.CustomLecture.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class VideoInfoRequestDTO {

    private Long videoid;
    private String voicename;

}
