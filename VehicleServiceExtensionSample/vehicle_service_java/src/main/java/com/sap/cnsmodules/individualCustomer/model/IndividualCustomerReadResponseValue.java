

/*
 * Individual Customer Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

package com.sap.cnsmodules.individualCustomer.model;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.annotation.JsonValue;
import com.sap.cnsmodules.individualCustomer.model.IndividualCustomerReadResponseValueAdminData;
import com.sap.cnsmodules.individualCustomer.model.IndividualCustomerReadResponseValueDefaultCommunication;
import java.util.UUID;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * IndividualCustomerReadResponseValue
 */

// CHECKSTYLE:OFF
public class IndividualCustomerReadResponseValue 
// CHECKSTYLE:ON
{
  @JsonProperty("id")
  private UUID id;

  @JsonProperty("displayId")
  private String displayId;

  @JsonProperty("lifeCycleStatus")
  private String lifeCycleStatus;

  @JsonProperty("isProspect")
  private Boolean isProspect;

  @JsonProperty("customerRole")
  private String customerRole;

  @JsonProperty("formattedName")
  private String formattedName;

  @JsonProperty("givenName")
  private String givenName;

  @JsonProperty("familyName")
  private String familyName;

  @JsonProperty("gender")
  private String gender;

  @JsonProperty("adminData")
  private IndividualCustomerReadResponseValueAdminData adminData;

  @JsonProperty("isBusinessPurposeCompleted")
  private Boolean isBusinessPurposeCompleted;

  @JsonProperty("defaultCommunication")
  private IndividualCustomerReadResponseValueDefaultCommunication defaultCommunication;

  @JsonProperty("lifeCycleStatusDescription")
  private String lifeCycleStatusDescription;

  @JsonProperty("customerRoleDescription")
  private String customerRoleDescription;

  @JsonProperty("genderDescription")
  private String genderDescription;

  @JsonAnySetter
  private final Map<String, Object> cloudSdkCustomFields = new LinkedHashMap<>();

   /**
   * Set the id of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param id  The id of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue id(@Nonnull final UUID id) {
    this.id = id;
    return this;
  }

   /**
   * Get id
   * @return id  The id of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public UUID getId() {
    return id;
  }

  /**
  * Set the id of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param id  The id of this {@link IndividualCustomerReadResponseValue}
  */
  public void setId( @Nonnull final UUID id) {
    this.id = id;
  }

   /**
   * Set the displayId of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param displayId  The displayId of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue displayId(@Nonnull final String displayId) {
    this.displayId = displayId;
    return this;
  }

   /**
   * Get displayId
   * @return displayId  The displayId of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public String getDisplayId() {
    return displayId;
  }

  /**
  * Set the displayId of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param displayId  The displayId of this {@link IndividualCustomerReadResponseValue}
  */
  public void setDisplayId( @Nonnull final String displayId) {
    this.displayId = displayId;
  }

   /**
   * Set the lifeCycleStatus of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param lifeCycleStatus  The lifeCycleStatus of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue lifeCycleStatus(@Nonnull final String lifeCycleStatus) {
    this.lifeCycleStatus = lifeCycleStatus;
    return this;
  }

   /**
   * Get lifeCycleStatus
   * @return lifeCycleStatus  The lifeCycleStatus of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public String getLifeCycleStatus() {
    return lifeCycleStatus;
  }

  /**
  * Set the lifeCycleStatus of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param lifeCycleStatus  The lifeCycleStatus of this {@link IndividualCustomerReadResponseValue}
  */
  public void setLifeCycleStatus( @Nonnull final String lifeCycleStatus) {
    this.lifeCycleStatus = lifeCycleStatus;
  }

   /**
   * Set the isProspect of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param isProspect  The isProspect of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue isProspect(@Nonnull final Boolean isProspect) {
    this.isProspect = isProspect;
    return this;
  }

   /**
   * Get isProspect
   * @return isProspect  The isProspect of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public Boolean isIsProspect() {
    return isProspect;
  }

  /**
  * Set the isProspect of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param isProspect  The isProspect of this {@link IndividualCustomerReadResponseValue}
  */
  public void setIsProspect( @Nonnull final Boolean isProspect) {
    this.isProspect = isProspect;
  }

   /**
   * Set the customerRole of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param customerRole  The customerRole of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue customerRole(@Nonnull final String customerRole) {
    this.customerRole = customerRole;
    return this;
  }

   /**
   * Get customerRole
   * @return customerRole  The customerRole of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public String getCustomerRole() {
    return customerRole;
  }

  /**
  * Set the customerRole of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param customerRole  The customerRole of this {@link IndividualCustomerReadResponseValue}
  */
  public void setCustomerRole( @Nonnull final String customerRole) {
    this.customerRole = customerRole;
  }

   /**
   * Set the formattedName of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param formattedName  The formattedName of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue formattedName(@Nonnull final String formattedName) {
    this.formattedName = formattedName;
    return this;
  }

   /**
   * Get formattedName
   * @return formattedName  The formattedName of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public String getFormattedName() {
    return formattedName;
  }

  /**
  * Set the formattedName of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param formattedName  The formattedName of this {@link IndividualCustomerReadResponseValue}
  */
  public void setFormattedName( @Nonnull final String formattedName) {
    this.formattedName = formattedName;
  }

   /**
   * Set the givenName of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param givenName  The givenName of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue givenName(@Nonnull final String givenName) {
    this.givenName = givenName;
    return this;
  }

   /**
   * Get givenName
   * @return givenName  The givenName of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public String getGivenName() {
    return givenName;
  }

  /**
  * Set the givenName of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param givenName  The givenName of this {@link IndividualCustomerReadResponseValue}
  */
  public void setGivenName( @Nonnull final String givenName) {
    this.givenName = givenName;
  }

   /**
   * Set the familyName of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param familyName  The familyName of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue familyName(@Nonnull final String familyName) {
    this.familyName = familyName;
    return this;
  }

   /**
   * Get familyName
   * @return familyName  The familyName of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public String getFamilyName() {
    return familyName;
  }

  /**
  * Set the familyName of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param familyName  The familyName of this {@link IndividualCustomerReadResponseValue}
  */
  public void setFamilyName( @Nonnull final String familyName) {
    this.familyName = familyName;
  }

   /**
   * Set the gender of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param gender  The gender of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue gender(@Nonnull final String gender) {
    this.gender = gender;
    return this;
  }

   /**
   * Get gender
   * @return gender  The gender of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public String getGender() {
    return gender;
  }

  /**
  * Set the gender of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param gender  The gender of this {@link IndividualCustomerReadResponseValue}
  */
  public void setGender( @Nonnull final String gender) {
    this.gender = gender;
  }

   /**
   * Set the adminData of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param adminData  The adminData of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue adminData(@Nonnull final IndividualCustomerReadResponseValueAdminData adminData) {
    this.adminData = adminData;
    return this;
  }

   /**
   * Get adminData
   * @return adminData  The adminData of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public IndividualCustomerReadResponseValueAdminData getAdminData() {
    return adminData;
  }

  /**
  * Set the adminData of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param adminData  The adminData of this {@link IndividualCustomerReadResponseValue}
  */
  public void setAdminData( @Nonnull final IndividualCustomerReadResponseValueAdminData adminData) {
    this.adminData = adminData;
  }

   /**
   * Set the isBusinessPurposeCompleted of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param isBusinessPurposeCompleted  The isBusinessPurposeCompleted of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue isBusinessPurposeCompleted(@Nonnull final Boolean isBusinessPurposeCompleted) {
    this.isBusinessPurposeCompleted = isBusinessPurposeCompleted;
    return this;
  }

   /**
   * Get isBusinessPurposeCompleted
   * @return isBusinessPurposeCompleted  The isBusinessPurposeCompleted of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public Boolean isIsBusinessPurposeCompleted() {
    return isBusinessPurposeCompleted;
  }

  /**
  * Set the isBusinessPurposeCompleted of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param isBusinessPurposeCompleted  The isBusinessPurposeCompleted of this {@link IndividualCustomerReadResponseValue}
  */
  public void setIsBusinessPurposeCompleted( @Nonnull final Boolean isBusinessPurposeCompleted) {
    this.isBusinessPurposeCompleted = isBusinessPurposeCompleted;
  }

   /**
   * Set the defaultCommunication of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param defaultCommunication  The defaultCommunication of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue defaultCommunication(@Nonnull final IndividualCustomerReadResponseValueDefaultCommunication defaultCommunication) {
    this.defaultCommunication = defaultCommunication;
    return this;
  }

   /**
   * Get defaultCommunication
   * @return defaultCommunication  The defaultCommunication of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public IndividualCustomerReadResponseValueDefaultCommunication getDefaultCommunication() {
    return defaultCommunication;
  }

  /**
  * Set the defaultCommunication of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param defaultCommunication  The defaultCommunication of this {@link IndividualCustomerReadResponseValue}
  */
  public void setDefaultCommunication( @Nonnull final IndividualCustomerReadResponseValueDefaultCommunication defaultCommunication) {
    this.defaultCommunication = defaultCommunication;
  }

   /**
   * Set the lifeCycleStatusDescription of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param lifeCycleStatusDescription  The lifeCycleStatusDescription of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue lifeCycleStatusDescription(@Nonnull final String lifeCycleStatusDescription) {
    this.lifeCycleStatusDescription = lifeCycleStatusDescription;
    return this;
  }

   /**
   * Get lifeCycleStatusDescription
   * @return lifeCycleStatusDescription  The lifeCycleStatusDescription of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public String getLifeCycleStatusDescription() {
    return lifeCycleStatusDescription;
  }

  /**
  * Set the lifeCycleStatusDescription of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param lifeCycleStatusDescription  The lifeCycleStatusDescription of this {@link IndividualCustomerReadResponseValue}
  */
  public void setLifeCycleStatusDescription( @Nonnull final String lifeCycleStatusDescription) {
    this.lifeCycleStatusDescription = lifeCycleStatusDescription;
  }

   /**
   * Set the customerRoleDescription of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param customerRoleDescription  The customerRoleDescription of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue customerRoleDescription(@Nonnull final String customerRoleDescription) {
    this.customerRoleDescription = customerRoleDescription;
    return this;
  }

   /**
   * Get customerRoleDescription
   * @return customerRoleDescription  The customerRoleDescription of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public String getCustomerRoleDescription() {
    return customerRoleDescription;
  }

  /**
  * Set the customerRoleDescription of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param customerRoleDescription  The customerRoleDescription of this {@link IndividualCustomerReadResponseValue}
  */
  public void setCustomerRoleDescription( @Nonnull final String customerRoleDescription) {
    this.customerRoleDescription = customerRoleDescription;
  }

   /**
   * Set the genderDescription of this {@link IndividualCustomerReadResponseValue} instance and return the same instance.
   *
   * @param genderDescription  The genderDescription of this {@link IndividualCustomerReadResponseValue}
   * @return The same instance of this {@link IndividualCustomerReadResponseValue} class
   */
   @Nonnull public IndividualCustomerReadResponseValue genderDescription(@Nonnull final String genderDescription) {
    this.genderDescription = genderDescription;
    return this;
  }

   /**
   * Get genderDescription
   * @return genderDescription  The genderDescription of this {@link IndividualCustomerReadResponseValue} instance.
  **/
  @Nonnull public String getGenderDescription() {
    return genderDescription;
  }

  /**
  * Set the genderDescription of this {@link IndividualCustomerReadResponseValue} instance.
  *
  * @param genderDescription  The genderDescription of this {@link IndividualCustomerReadResponseValue}
  */
  public void setGenderDescription( @Nonnull final String genderDescription) {
    this.genderDescription = genderDescription;
  }

  /**
   * Get the names of the unrecognizable properties of the {@link IndividualCustomerReadResponseValue}.
   * @return The set of properties names
   */
  @Nonnull
  public Set<String> getCustomFieldNames() {
    return cloudSdkCustomFields.keySet();
  }

  /**
   * Get the value of an unrecognizable property of the {@link IndividualCustomerReadResponseValue}.
   * @param name  The name of the property
   * @return The value of the property
   * @throws NoSuchElementException  If no property with the given name could be found.
   */
  @Nullable
  public Object getCustomField(@Nonnull final String name) throws NoSuchElementException {
    if( !cloudSdkCustomFields.containsKey(name) ) {
        throw new NoSuchElementException("IndividualCustomerReadResponseValue has no field with name '" + name + "'.");
    }
    return cloudSdkCustomFields.get(name);
  }

  @Override
  public boolean equals(@Nullable final java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    final IndividualCustomerReadResponseValue individualCustomerReadResponseValue = (IndividualCustomerReadResponseValue) o;
    return Objects.equals(this.cloudSdkCustomFields, individualCustomerReadResponseValue.cloudSdkCustomFields) &&
        Objects.equals(this.id, individualCustomerReadResponseValue.id) &&
        Objects.equals(this.displayId, individualCustomerReadResponseValue.displayId) &&
        Objects.equals(this.lifeCycleStatus, individualCustomerReadResponseValue.lifeCycleStatus) &&
        Objects.equals(this.isProspect, individualCustomerReadResponseValue.isProspect) &&
        Objects.equals(this.customerRole, individualCustomerReadResponseValue.customerRole) &&
        Objects.equals(this.formattedName, individualCustomerReadResponseValue.formattedName) &&
        Objects.equals(this.givenName, individualCustomerReadResponseValue.givenName) &&
        Objects.equals(this.familyName, individualCustomerReadResponseValue.familyName) &&
        Objects.equals(this.gender, individualCustomerReadResponseValue.gender) &&
        Objects.equals(this.adminData, individualCustomerReadResponseValue.adminData) &&
        Objects.equals(this.isBusinessPurposeCompleted, individualCustomerReadResponseValue.isBusinessPurposeCompleted) &&
        Objects.equals(this.defaultCommunication, individualCustomerReadResponseValue.defaultCommunication) &&
        Objects.equals(this.lifeCycleStatusDescription, individualCustomerReadResponseValue.lifeCycleStatusDescription) &&
        Objects.equals(this.customerRoleDescription, individualCustomerReadResponseValue.customerRoleDescription) &&
        Objects.equals(this.genderDescription, individualCustomerReadResponseValue.genderDescription);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, displayId, lifeCycleStatus, isProspect, customerRole, formattedName, givenName, familyName, gender, adminData, isBusinessPurposeCompleted, defaultCommunication, lifeCycleStatusDescription, customerRoleDescription, genderDescription, cloudSdkCustomFields);
  }

  @Override
  @Nonnull public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("class IndividualCustomerReadResponseValue {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    displayId: ").append(toIndentedString(displayId)).append("\n");
    sb.append("    lifeCycleStatus: ").append(toIndentedString(lifeCycleStatus)).append("\n");
    sb.append("    isProspect: ").append(toIndentedString(isProspect)).append("\n");
    sb.append("    customerRole: ").append(toIndentedString(customerRole)).append("\n");
    sb.append("    formattedName: ").append(toIndentedString(formattedName)).append("\n");
    sb.append("    givenName: ").append(toIndentedString(givenName)).append("\n");
    sb.append("    familyName: ").append(toIndentedString(familyName)).append("\n");
    sb.append("    gender: ").append(toIndentedString(gender)).append("\n");
    sb.append("    adminData: ").append(toIndentedString(adminData)).append("\n");
    sb.append("    isBusinessPurposeCompleted: ").append(toIndentedString(isBusinessPurposeCompleted)).append("\n");
    sb.append("    defaultCommunication: ").append(toIndentedString(defaultCommunication)).append("\n");
    sb.append("    lifeCycleStatusDescription: ").append(toIndentedString(lifeCycleStatusDescription)).append("\n");
    sb.append("    customerRoleDescription: ").append(toIndentedString(customerRoleDescription)).append("\n");
    sb.append("    genderDescription: ").append(toIndentedString(genderDescription)).append("\n");
    cloudSdkCustomFields.forEach((k,v) -> sb.append("    ").append(k).append(": ").append(toIndentedString(v)).append("\n"));
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(final java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }

}

