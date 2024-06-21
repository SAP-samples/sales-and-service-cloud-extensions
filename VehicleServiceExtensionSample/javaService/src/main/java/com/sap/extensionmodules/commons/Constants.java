package com.sap.extensionmodules.commons;

import java.util.Collections;
import java.util.List;

public class Constants {
    public static final String GLOBAL_PREFIX = "vehicle-service";
    public static final String DESTINATION = "staging";
    public static final String DB_TYPE = "sap";
    public static final String FALLBACK_LANGUAGE = "en";
    public static final String SESSION = "session";
    public static final String TRANSLATION_JSON_FILE = "vehicleService";

    public static class Messages {
        public static final String DB_ERROR = "DB Error.";
        public static final String UNIQUE_KEY_CONSTRAINT_FAILED = "Unique key constraint violation.";
        public static final String NO_UPDATE_DATA = "No update data provided";
        public static final String CANNOT_UPDATE_SERVICE_FORM = "Service Form can be updated only in DRAFT mode";
        public static final String INTERNAL_SERVER_ERROR = "Internal Server Error";
        public static final String RESOURCE_NOT_FOUND = "Resource with the provided id not found";
        public static final String INSPECTION_ITEM_RESOURCE_NOT_FOUND = "InspectionItem Resource with the provided id not found";
        public static final String SERVICE_RESOURCE_NOT_FOUND = "Services Resource with the provided id not found";
        public static final String SERVICE_FORM_RESOURCE_NOT_FOUND = "ServiceForm Resource with the provided id not found";

        public static final String EMPLOYEE_RESOURCE_NOT_FOUND = "Employee Resource with the provided id not found";
        public static final String CASE_COMPLETED = "Case is Completed. Cannot create Job Card for Completed Case";
        public static final String NO_REGISTERED_PRODUCTS_IN_CASE = "No Registered Products in the case";
        public static final String NO_REGISTERED_PRODUCTS_WITH_VEHICLE_NO = "No Registered Products with given Vehicle Number";
        public static final String NO_VEHICLE_NUMBER = "No Vehicle Number in the registered product";
        public static final String JOB_CARD_EXISTS = "Job Card already exists for the case given";
        public static final String NO_MILOMETER_IN_CASE = "No milometer reading in case";
        public static final String NO_SERVICES_SELECTED = "No Services selected in service form";
        public static final String SERVICE_FORM_NOT_BOOKED = "Service Form is not booked";
        public static final String CASE_STATUS_DISABLED =
                "Status of the Case cannot be changed because all the tasks under the Job Card are not completed.";
        public static final String JOBCARD_NOT_FOUND = "No jobcard found for selected Case";
        public static final String JOBCARD_ID_NOT_FOUND = "JobCard Resource with the provided id not found";
        public static final String ERR_IN_INVOICE = "Error in generate Invoice : ";
        public static final String CUSTOM_LOGIC_ERROR = "Custom logic errors raised.";
        public static final String HTTP_PRECONDITION_REQUIRED = "The precondition If-Match is missing in the header";
        public static final String HTTP_PRECONDITION_FAILED = "The precondition If-Match has failed. Resource is not the latest, please update the resource";
        public static final String INVALID_SOURCE_TYPE = "Invalid sourceType.";
        public static final String INVALID_SOURCE_ID = "sourceid must be a UUID";
        public static final String INVALID_JOBCARD_STATUS = "Invalid status. Valid values are:";
        public static final String INVALID_EMPLOYEE = "Invalid Employee ID";
    }

    public static class ExtensionFields {
        public static final String EXTENSIONS = "extensions";
        public static String JOBCARD_ID;
        public static String VEHICLE_NUMBER;
        public static String MILOMETER;
        public static String SERVICE_FORM_ID;
    }

    public static class CaseStatus {
        public static String BOOKED;
        public static String SERVICE_IN_PROCESS;
        public static String SERVICE_COMPLETED;
        public static String COMPLETED;
        public static String CLOSED;
    }

    public static class EntityName {
        public static final String CASE = "sap.crm.caseservice.entity.case";
    }

    public static final String CREATE_DOCUMENT_URL = "/sap/c4c/api/v1/document-service/documents";
    public static final String X_SAP_CRM_TOKEN = "eyJraWQiOiIzMmI5NWY0Yy1mYThmLTExZWQtODljMi1iZjk4M2E2ZmVhOWMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJVU0VSLk5BIiwiZWlkIjoiMTFlYzczOTktMTg0ZS01YTllLWFmZGItMjM0NTRjNTM0MTIzIiwibG9nIjoxLCJpc3MiOiJjb20uc2FwLmNybS5pYW0iLCJhZG1pbiI6dHJ1ZSwibGFuZ3VhZ2UiOiJlbiIsInR5cCI6IjEiLCJub24iOiJSOE9CTzREbTFBQUdlUkJ4dGRIY2JJRjlpbUkiLCJsb2NhbGUiOiJlbi1VUyIsInNwaWQiOiJmZTM1ODM5MS1lZWQ3LTExZTktYTI1Mi0wNWM3MmVlNzQ0Y2QiLCJhdWQiOiJucy1zdGFnaW5nLmN4bS1zYWxlc2Nsb3VkLmNvbSIsInVpZCI6ImZlMzU4MzkxLWVlZDctMTFlOS1hMjUyLTA1YzcyZWU3NDRjZCIsImM0YyI6ZmFsc2UsInppZCI6IjVkOTRlNDQ2Y2QzY2RjNmY3YzMyNGM1MCIsInJ0diI6ODY0MDAsInV0eSI6IlVTRVIiLCJleHAiOjE2ODU2ODk4MDIsImFpZCI6Im5zIn0.AM0Eu5Tf4oxHmof8DR0gRKuA06hEeoybHq58Du9aJ53ljBi_YEMj7aRLt64Mfbp6d-obbRuZ3p8wMQHOuvOKh3fEkwiHtoLByefoY2OEXfvByvtiwDFA-aeMnY6MPrzs4Hix1ZZDMQNnRHmIqKUlJwpjjy7eAbAV0bl2eVSOcaobClJ8nITFZ2U_yPidKfUtaxy9mlg46xTI6dWh8Y4Omv8a5K1PsIBmpTrD4QUYZU9pywwuVKoHn-t_3xJ84p1x2Dz-yGLeyubMUIBUMuPD9CLVIsu5TX0rE7ldCcdyxQ9ZC9KL6WTMakx8_TQg_ir50dq2dF8sasdFxTHrGaF2ow";
    public static class CustomLogicErrorCode{
        public static final String CASE_SERVICE = "caseService_customLogic";

    }
    public static class CaseType{
        public static final String VEHICLE_SERVICE_REQUEST = "ZVSR";

    }

    public static final String QUERY_OPTION_FILTER = "$filter";
    public static final String QUERY_OPTION_SEARCH = "$search";
    public static final String QUERY_OPTION_TOP = "$top";
    public static final String QUERY_OPTION_SKIP = "$skip";
    public static final String AND_DELIMITER = " and ";
    public static final String OR_DELIMITER = " or ";
    public static final String SPACE_DELIMITER = " ";
    public static final String COMMA_DELIMITER = ",";
    public static final String SINGLE_QUOTES_DELIMITER = "\'";
    public static final String QUOTES_DELIMITER = "\"";

    public static final String DESTINATION_SERVICE_URL = "/destination-configuration/v1/destinations/";
    public static final String[] AUTHORIZED_FIELDS = {"status", "observation"};
    public static final String EditTaskRole = "EditTask";
    public static final String EditJobCardService = "EditJobCardService";
    public static final String CANNOT_EDIT_OTHER_USER_RECORDS = "User cannot edit other user's records";
    public static final String CANNOT_EDIT_FIELD = "User does not have access to edit the field: ";

    public static final int DEFAULT_PAGE_SIZE = 50;
    public static final int MAX_PAGE_SIZE = 999;
}
