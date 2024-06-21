package com.sap.extensionmodules.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sap.extensionmodules.Utils.RegisteredProductConverter;
import com.sap.extensionmodules.dtos.RegisteredProduct;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.GenerationTime;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@ToString
@Table(name = "\"job_card\"")
public class JobCard {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name ="\"id\"", unique=true)
    private String id;

    @Generated(GenerationTime.INSERT)
    @Column(name ="\"displayId\"", insertable = false, updatable = false)
    private int displayId;

    @Column(name = "\"caseId\"", unique=true)
    private String caseId;

    @Column(name = "\"caseDisplayId\"")
    private String caseDisplayId;

    @Convert(converter = RegisteredProductConverter.class)
    @Column(name = "\"registeredProduct\"")
    private RegisteredProduct registeredProduct; //RegisteredProduct

    @Column(name = "\"customerComplaints\"")
    private String customerComplaints;

    @Column(name = "\"milometer\"")
    private int milometer;

    @Column(name = "\"estimatedCompletionDate\"")
    @org.hibernate.annotations.ColumnDefault("")
    private String estimatedCompletionDate;

    @Column(name = "\"createdOn\"")
    private String createdOn;

    @Column(name = "\"status\"")
    private String status; //Status

    @Column(name = "\"updatedOn\"")
    private String updatedOn;

    @Column(name = "\"createdBy\"")
    private String createdBy;

    @Column(name = "\"updatedBy\"")
    private String updatedBy;

    @JsonManagedReference
    @ToString.Exclude
    @OneToMany(mappedBy="jobCard", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobCardServices> servicesSelected = new ArrayList<>();

    @JsonManagedReference
    @ToString.Exclude
    @OneToOne(mappedBy = "jobCard", cascade = CascadeType.PERSIST)
    private ServiceForm serviceForm;

    @Column(name = "\"vehicleNumber\"")
    @ColumnDefault("")
    private String vehicleNumber;

    @Column(name = "\"model\"")
    @ColumnDefault("")
    private String model;

    public void addServicesSelected(JobCardServices service) {
        servicesSelected.add(service);
        service.setJobCard(this);
    }

    public void removeServicesSelected(JobCardServices service) {
        servicesSelected.remove(service);
        service.setJobCard(null);
    }

    public void addServiceForm(ServiceForm form){
        serviceForm=form;
        serviceForm.setJobCard(this);
    }
}

