package com.sap.extensionmodules.commons;

public enum RoleCodes {
    R21("R21"), // Service Advisor
    R22("R22"), // Service Manager
    R23("R23"); // Service Technician

    private final String code;

    RoleCodes(String code) {
        this.code = code;
    }
}
