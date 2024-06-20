package com.sap.extensionmodules.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@ToString
@Table(name = "\"job_card_services\"")
public class JobCardServices {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name ="\"id\"", unique=true)
    private String id;

    @Column(name ="\"service\"")
    private String service;
    @Column(name = "\"price\"")
    private String price;

    @Column(name = "\"technician\"")
    @ColumnDefault("{\"btpUserId\":\"\",\"name\":\"\"}")
    private String technician;
    @Column(name = "\"status\"")
    private String status;
    @Column(name = "\"startTime\"")
    private String startTime;
    @Column(name = "\"endTime\"")
    private String endTime;
    @Column(name = "\"notes\"")
    private String notes;
    @Column(name = "\"observation\"")
    private String observation;
    @Column(name = "\"createdOn\"")
    private String createdOn;
    @Column(name = "\"updatedOn\"")
    private String updatedOn;
    @Column(name = "\"createdBy\"")
    private String createdBy;
    @Column(name = "\"updatedBy\"")
    private String updatedBy;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"jobCardId\"", updatable = false)
    private JobCard jobCard;
}
