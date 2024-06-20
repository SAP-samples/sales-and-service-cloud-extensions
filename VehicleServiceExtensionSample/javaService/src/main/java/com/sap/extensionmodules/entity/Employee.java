package com.sap.extensionmodules.entity;

import com.sap.extensionmodules.commons.RoleCodes;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@ToString
@Table(name = "\"employee\"")
public class Employee {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name ="\"id\"", unique=true)
    private String id;

    @Column(name = "\"btpUserId\"")
    private String btpUserId;

    @Column(name = "\"email\"")
    private String email;

    @Column(name = "\"name\"")
    private String name;

    @Column(name = "\"roleName\"")
    private String roleName;

    @Column(name = "\"roleCode\"")
    @Enumerated(EnumType.STRING)
    private RoleCodes roleCode;

    @Column(name = "\"createdOn\"")
    private String createdOn;

    @Column(name = "\"updatedOn\"")
    private String updatedOn;

    @Column(name = "\"createdBy\"")
    private String createdBy;

    @Column(name = "\"updatedBy\"")
    private String updatedBy;

//    @Column(name = "\"adminData\"")
//    private AdminData adminData;
}
