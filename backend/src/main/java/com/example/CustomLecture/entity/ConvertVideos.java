package com.example.CustomLecture.entity;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "convertVideos")
@NoArgsConstructor
public class ConvertVideos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String AconvertS3Path;

    @Column(unique = true)
    private String BconvertS3Path;

    @Column(unique = true)
    private String CconvertS3Path;

    @Column(unique = true)
    private String DconvertS3Path;

    public String toString() {
        return "AconvertS3Path : " + this.AconvertS3Path + "," +
                "BconvertS3Path : " + this.BconvertS3Path + "," +
                "CconvertS3Path : " + this.CconvertS3Path + "," +
                "DconvertS3Path : " + this.DconvertS3Path + ",";
    }
}
