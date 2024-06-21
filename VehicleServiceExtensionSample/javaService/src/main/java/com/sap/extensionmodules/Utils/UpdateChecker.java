package com.sap.extensionmodules.Utils;

import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.exception.APIExceptionHandler;
import org.springframework.stereotype.Service;

@Service
public class UpdateChecker {

    public static void isUpdateOnLatestData(String ifmatch, String updatedOn) {
        //If-match not to be implemented
        if (ifmatch == null || ifmatch.isEmpty()) {
            //throw APIExceptionHandler.preconditionRequired(Constants.Messages.HTTP_PRECONDITION_REQUIRED);
        }

        if (!updatedOn.equals(ifmatch)) {
            //throw APIExceptionHandler.preconditionFailed(Constants.Messages.HTTP_PRECONDITION_FAILED);
        }
    }
}

