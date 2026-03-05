/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'Employeefile' schema.
 */
export type Employeefile = {
  value?: {
    /**
     * Format: "uuid".
     */
    id?: string | null;
    /**
     * Max Length: 10.
     * Min Length: 1.
     */
    displayId?: string | null;
    /**
     * Max Length: 20.
     * Min Length: 1.
     */
    employeeDisplayId: string;
    isInternalEmployee?: boolean | null;
    /**
     * Max Length: 255.
     * Min Length: 1.
     */
    formattedName?: string | null;
    /**
     * Max Length: 14.
     * Min Length: 1.
     */
    lifeCycleStatus?: string | null;
    /**
     * Max Length: 255.
     * Min Length: 1.
     */
    lifeCycleStatusDescription?: string | null;
    /**
     * Max Length: 4.
     * Min Length: 1.
     */
    formOfAddress?: string | null;
    /**
     * Max Length: 255.
     * Min Length: 1.
     */
    formOfAddressDescription?: string | null;
    /**
     * Max Length: 4.
     * Min Length: 1.
     */
    academicTitle?: string | null;
    /**
     * Max Length: 255.
     * Min Length: 1.
     */
    academicTitleDescription?: string | null;
    /**
     * Max Length: 40.
     */
    givenName?: string | null;
    /**
     * Max Length: 40.
     */
    middleName?: string | null;
    /**
     * Max Length: 40.
     * Min Length: 1.
     */
    familyName: string;
    /**
     * Max Length: 40.
     */
    additionalFamilyName?: string | null;
    /**
     * Max Length: 10.
     * Min Length: 1.
     */
    initialsName?: string | null;
    /**
     * Max Length: 40.
     * Min Length: 1.
     */
    nickName?: string | null;
    /**
     * Max Length: 1.
     * Min Length: 1.
     */
    gender?: string | null;
    /**
     * Max Length: 255.
     * Min Length: 1.
     */
    genderDescription?: string | null;
    /**
     * Max Length: 1.
     * Min Length: 1.
     */
    maritalStatus?: string | null;
    /**
     * Max Length: 255.
     * Min Length: 1.
     */
    maritalStatusDescription?: string | null;
    /**
     * Max Length: 5.
     * Min Length: 2.
     */
    nonVerbalCommunicationLanguage?: string | null;
    /**
     * Max Length: 255.
     * Min Length: 1.
     */
    nonVerbalCommunicationLanguageDescription?: string | null;
    /**
     * Format: "date".
     */
    birthDate?: string | null;
    /**
     * Max Length: 3.
     * Min Length: 2.
     */
    nationalityCountry?: string | null;
    /**
     * Max Length: 255.
     * Min Length: 1.
     */
    nationalityCountryDescription?: string | null;
    /**
     * Max Length: 100.
     * Min Length: 1.
     */
    defaultExternalBusinessPartnerId?: string | null;
    /**
     * Max Length: 100.
     * Min Length: 1.
     */
    defaultExternalEmployeeId?: string | null;
    /**
     * Format: "uuid".
     */
    organizationalUnitId?: string | null;
    /**
     * Max Length: 50.
     * Min Length: 1.
     */
    organizationalUnitDisplayId?: string | null;
    /**
     * Max Length: 40.
     * Min Length: 1.
     */
    organizationalUnitName?: string | null;
    /**
     * Format: "uuid".
     */
    managerId?: string | null;
    /**
     * Max Length: 20.
     * Min Length: 1.
     */
    managerEmployeeDisplayId?: string | null;
    /**
     * Max Length: 255.
     * Min Length: 1.
     */
    managerFormattedName?: string | null;
    workplaceAddress?: {
      /**
       * Max Length: 80.
       */
      streetName?: string | null;
      /**
       * Max Length: 10.
       */
      houseId?: string | null;
      /**
       * Max Length: 40.
       */
      cityName?: string | null;
      /**
       * Max Length: 10.
       */
      postalCode?: string | null;
      /**
       * Max Length: 3.
       * Min Length: 2.
       */
      country?: string | null;
      /**
       * Max Length: 255.
       * Min Length: 1.
       */
      countryDescription?: string | null;
      region?: {
        /**
         * Max Length: 3.
         * Min Length: 2.
         */
        country?: string | null;
        /**
         * Max Length: 6.
         * Min Length: 1.
         */
        region?: string | null;
      } & Record<string, any>;
      /**
       * Max Length: 255.
       * Min Length: 1.
       */
      regionDescription?: string | null;
      /**
       * Max Length: 40.
       */
      countyName?: string | null;
      /**
       * Max Length: 40.
       */
      districtName?: string | null;
      latitudeMeasure?: number | null;
      longitudeMeasure?: number | null;
      /**
       * Max Length: 10.
       */
      buildingId?: string | null;
      /**
       * Max Length: 10.
       */
      floorId?: string | null;
      /**
       * Max Length: 10.
       */
      roomId?: string | null;
      /**
       * Max Length: 40.
       * Min Length: 1.
       */
      phoneFormattedNumber?: string | null;
      /**
       * Max Length: 40.
       * Min Length: 1.
       */
      phoneNormalisedNumber?: string | null;
      /**
       * Max Length: 40.
       * Min Length: 1.
       */
      mobileFormattedNumber?: string | null;
      /**
       * Max Length: 40.
       * Min Length: 1.
       */
      mobileNormalisedNumber?: string | null;
      /**
       * Format: "email".
       * Max Length: 255.
       * Min Length: 1.
       */
      eMail?: string | null;
      /**
       * Max Length: 40.
       * Min Length: 1.
       */
      streetPrefixName?: string | null;
      /**
       * Max Length: 40.
       * Min Length: 1.
       */
      additionalStreetPrefixName?: string | null;
      /**
       * Max Length: 40.
       * Min Length: 1.
       */
      streetSuffixName?: string | null;
      /**
       * Max Length: 40.
       * Min Length: 1.
       */
      additionalStreetSuffixName?: string | null;
      /**
       * Max Length: 10.
       * Min Length: 1.
       */
      postOfficeBoxId?: string | null;
      isPostOfficeBoxAddress?: boolean | null;
      /**
       * Max Length: 255.
       * Min Length: 1.
       */
      formattedPostalAddressDescription?: string | null;
      /**
       * Max Length: 40.
       */
      additionalCityName?: string | null;
      /**
       * Max Length: 10.
       */
      additionalHouseId?: string | null;
      /**
       * Max Length: 40.
       */
      careOfName?: string | null;
    } & Record<string, any>;
    isBusinessPurposeCompleted?: boolean | null;
    adminData?: {
      /**
       * Format: "date-time".
       */
      createdOn?: string | null;
      /**
       * Format: "uuid".
       */
      createdBy?: string | null;
      createdByName?: string | null;
      /**
       * Format: "date-time".
       */
      updatedOn?: string | null;
      /**
       * Format: "uuid".
       */
      updatedBy?: string | null;
      updatedByName?: string | null;
    } & Record<string, any>;
    employeeTypes?: ({
      /**
       * Format: "uuid".
       */
      id?: string | null;
      isInternalEmployee?: boolean | null;
      /**
       * Format: "date".
       */
      validFrom?: string | null;
      /**
       * Format: "date".
       */
      validTo?: string | null;
    } & Record<string, any>)[];
    workingHours?: ({
      /**
       * Format: "uuid".
       */
      id?: string | null;
      /**
       * Max Length: 13.
       * Min Length: 1.
       */
      type?: string | null;
      /**
       * Max Length: 255.
       * Min Length: 1.
       */
      typeDescription?: string | null;
      /**
       * Format: "date".
       */
      validFrom?: string | null;
      /**
       * Format: "date".
       */
      validTo?: string | null;
      /**
       * Max Length: 10.
       * Min Length: 1.
       */
      timeZone?: string | null;
      /**
       * Max Length: 255.
       * Min Length: 1.
       */
      timeZoneDescription?: string | null;
      /**
       * Max Length: 6.
       * Min Length: 1.
       */
      workingDayCalendar?: string | null;
      /**
       * Max Length: 255.
       * Min Length: 1.
       */
      workingDayCalendarDescription?: string | null;
      operatingPeriods?: ({
        /**
         * Format: "uuid".
         */
        id?: string | null;
        /**
         * Max Length: 9.
         * Min Length: 1.
         */
        weekday?: string | null;
        /**
         * Format: "time".
         */
        startTime?: string | null;
        /**
         * Format: "time".
         */
        endTime?: string | null;
      } & Record<string, any>)[];
    } & Record<string, any>)[];
    employeeSalesResponsibilities?: ({
      /**
       * Format: "uuid".
       */
      id?: string | null;
      /**
       * Format: "uuid".
       */
      salesOrganizationId?: string | null;
      /**
       * Max Length: 50.
       * Min Length: 1.
       */
      salesOrganizationDisplayId?: string | null;
      /**
       * Max Length: 40.
       */
      salesOrganizationName?: string | null;
      /**
       * Max Length: 2.
       * Min Length: 1.
       */
      distributionChannel?: string | null;
      /**
       * Max Length: 50.
       * Min Length: 1.
       */
      distributionChannelDescription?: string | null;
      /**
       * Max Length: 2.
       * Min Length: 1.
       */
      division?: string | null;
      /**
       * Max Length: 50.
       * Min Length: 1.
       */
      divisionDescription?: string | null;
      isDefault?: boolean | null;
    } & Record<string, any>)[];
    attachments?: ({
      /**
       * Format: "uuid".
       */
      id?: string | null;
      title?: string | null;
      type?: string | null;
      category?: string | null;
      fileSize?: number | null;
      fileName?: string | null;
      contentType?: string | null;
      url?: string | null;
    } & Record<string, any>)[];
    externalIds?: ({
      /**
       * Format: "uuid".
       */
      id?: string | null;
      /**
       * Max Length: 100.
       */
      externalId?: string | null;
      /**
       * Format: "uuid".
       */
      communicationSystemId?: string | null;
      communicationSystemDisplayId?: string | null;
      /**
       * Max Length: 15.
       */
      type?: string | null;
      isDefault?: boolean | null;
    } & Record<string, any>)[];
  } & Record<string, any>;
} & Record<string, any>;
