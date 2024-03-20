package com.example.CustomLecture.dto.Request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class VideoConvertRequestDTO {
    private String url;
    private String gender;
}
