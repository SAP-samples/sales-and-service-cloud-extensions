

/*
 * Case Service
 * Cases are records of service or support requests from an account or individual customer used to track interactions with the requestor. Cases also record details like how much time has passed since the case was created, what actions were taken to resolve the issue, priority or associated products, and much more.  Use this API to view, create, and manage your cases.
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

package com.sap.cnsmodules.model;

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
import com.sap.cnsmodules.model.CaseQueryResponseValueInnerAccount;
import com.sap.cnsmodules.model.CaseQueryResponseValueInnerContact;
import com.sap.cnsmodules.model.CaseQueryResponseValueInnerDescription;
import com.sap.cnsmodules.model.CaseQueryResponseValueInnerFunctionalLocationsInner;
import com.sap.cnsmodules.model.CaseQueryResponseValueInnerIndividualCustomer;
import com.sap.cnsmodules.model.CaseQueryResponseValueInnerNotesInner;
import com.sap.cnsmodules.model.CaseQueryResponseValueInnerRegisteredProductsInner;
import com.sap.cnsmodules.model.CaseQueryResponseValueInnerServiceTeam;
import com.sap.cnsmodules.model.CaseReadResponseValueTimePoints;
import com.sap.cnsmodules.model.CaseUpdateRequestAttachmentsInner;
import java.util.ArrayList;
import java.util.List;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * CasePatchUpdateRequest
 */

// CHECKSTYLE:OFF
public class CasePatchUpdateRequest 
// CHECKSTYLE:ON
{
  @JsonProperty("subject")
  private String subject;

  @JsonProperty("priority")
  private String priority;

  @JsonProperty("status")
  private String status;

  @JsonProperty("escalationStatus")
  private String escalationStatus;

  @JsonProperty("registeredProducts")
  private List<CaseQueryResponseValueInnerRegisteredProductsInner> registeredProducts = new ArrayList<>();

  @JsonProperty("functionalLocations")
  private List<CaseQueryResponseValueInnerFunctionalLocationsInner> functionalLocations = new ArrayList<>();

  @JsonProperty("productInstallPoints")
  private List<CaseQueryResponseValueInnerFunctionalLocationsInner> productInstallPoints = new ArrayList<>();

  @JsonProperty("installedBases")
  private List<CaseQueryResponseValueInnerFunctionalLocationsInner> installedBases = new ArrayList<>();

  @JsonProperty("account")
  private CaseQueryResponseValueInnerAccount account;

  @JsonProperty("contact")
  private CaseQueryResponseValueInnerContact contact;

  @JsonProperty("individualCustomer")
  private CaseQueryResponseValueInnerIndividualCustomer individualCustomer;

  @JsonProperty("processor")
  private CaseQueryResponseValueInnerIndividualCustomer processor;

  @JsonProperty("approvers")
  private List<CaseQueryResponseValueInnerIndividualCustomer> approvers = new ArrayList<>();

  @JsonProperty("serviceTeam")
  private CaseQueryResponseValueInnerServiceTeam serviceTeam;

  @JsonProperty("description")
  private CaseQueryResponseValueInnerDescription description;

  @JsonProperty("notes")
  private List<CaseQueryResponseValueInnerNotesInner> notes = new ArrayList<>();

  @JsonProperty("timePoints")
  private CaseReadResponseValueTimePoints timePoints;

  @JsonProperty("categoryLevel1")
  private CaseQueryResponseValueInnerFunctionalLocationsInner categoryLevel1;

  @JsonProperty("categoryLevel2")
  private CaseQueryResponseValueInnerFunctionalLocationsInner categoryLevel2;

  @JsonProperty("extensions")
  private Object extensions;

  @JsonProperty("attachments")
  private List<CaseUpdateRequestAttachmentsInner> attachments = new ArrayList<>();

  @JsonAnySetter
  private final Map<String, Object> cloudSdkCustomFields = new LinkedHashMap<>();

   /**
   * Set the subject of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param subject  The subject of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest subject(@Nonnull final String subject) {
    this.subject = subject;
    return this;
  }

   /**
   * Get subject
   * @return subject  The subject of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public String getSubject() {
    return subject;
  }

  /**
  * Set the subject of this {@link CasePatchUpdateRequest} instance.
  *
  * @param subject  The subject of this {@link CasePatchUpdateRequest}
  */
  public void setSubject( @Nonnull final String subject) {
    this.subject = subject;
  }

   /**
   * Set the priority of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param priority  The priority of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest priority(@Nonnull final String priority) {
    this.priority = priority;
    return this;
  }

   /**
   * Get priority
   * @return priority  The priority of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public String getPriority() {
    return priority;
  }

  /**
  * Set the priority of this {@link CasePatchUpdateRequest} instance.
  *
  * @param priority  The priority of this {@link CasePatchUpdateRequest}
  */
  public void setPriority( @Nonnull final String priority) {
    this.priority = priority;
  }

   /**
   * Set the status of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param status  The status of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest status(@Nonnull final String status) {
    this.status = status;
    return this;
  }

   /**
   * Get status
   * @return status  The status of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public String getStatus() {
    return status;
  }

  /**
  * Set the status of this {@link CasePatchUpdateRequest} instance.
  *
  * @param status  The status of this {@link CasePatchUpdateRequest}
  */
  public void setStatus( @Nonnull final String status) {
    this.status = status;
  }

   /**
   * Set the escalationStatus of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param escalationStatus  The escalationStatus of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest escalationStatus(@Nonnull final String escalationStatus) {
    this.escalationStatus = escalationStatus;
    return this;
  }

   /**
   * Get escalationStatus
   * @return escalationStatus  The escalationStatus of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public String getEscalationStatus() {
    return escalationStatus;
  }

  /**
  * Set the escalationStatus of this {@link CasePatchUpdateRequest} instance.
  *
  * @param escalationStatus  The escalationStatus of this {@link CasePatchUpdateRequest}
  */
  public void setEscalationStatus( @Nonnull final String escalationStatus) {
    this.escalationStatus = escalationStatus;
  }

   /**
   * Set the registeredProducts of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param registeredProducts  The registeredProducts of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest registeredProducts(@Nonnull final List<CaseQueryResponseValueInnerRegisteredProductsInner> registeredProducts) {
    this.registeredProducts = registeredProducts;
    return this;
  }
  /**
  * Add one RegisteredProducts instance to this {@link CasePatchUpdateRequest}.
  * @param registeredProductsItem The RegisteredProducts that should be added
  * @return The same instance of type {@link CasePatchUpdateRequest}
  */
  @Nonnull public CasePatchUpdateRequest addRegisteredProductsItem( @Nonnull final CaseQueryResponseValueInnerRegisteredProductsInner registeredProductsItem) {
    if (this.registeredProducts == null) {
      this.registeredProducts = new ArrayList<>();
    }
    this.registeredProducts.add(registeredProductsItem);
    return this;
  }

   /**
   * Get registeredProducts
   * @return registeredProducts  The registeredProducts of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public List<CaseQueryResponseValueInnerRegisteredProductsInner> getRegisteredProducts() {
    return registeredProducts;
  }

  /**
  * Set the registeredProducts of this {@link CasePatchUpdateRequest} instance.
  *
  * @param registeredProducts  The registeredProducts of this {@link CasePatchUpdateRequest}
  */
  public void setRegisteredProducts( @Nonnull final List<CaseQueryResponseValueInnerRegisteredProductsInner> registeredProducts) {
    this.registeredProducts = registeredProducts;
  }

   /**
   * Set the functionalLocations of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param functionalLocations  The functionalLocations of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest functionalLocations(@Nonnull final List<CaseQueryResponseValueInnerFunctionalLocationsInner> functionalLocations) {
    this.functionalLocations = functionalLocations;
    return this;
  }
  /**
  * Add one FunctionalLocations instance to this {@link CasePatchUpdateRequest}.
  * @param functionalLocationsItem The FunctionalLocations that should be added
  * @return The same instance of type {@link CasePatchUpdateRequest}
  */
  @Nonnull public CasePatchUpdateRequest addFunctionalLocationsItem( @Nonnull final CaseQueryResponseValueInnerFunctionalLocationsInner functionalLocationsItem) {
    if (this.functionalLocations == null) {
      this.functionalLocations = new ArrayList<>();
    }
    this.functionalLocations.add(functionalLocationsItem);
    return this;
  }

   /**
   * Get functionalLocations
   * @return functionalLocations  The functionalLocations of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public List<CaseQueryResponseValueInnerFunctionalLocationsInner> getFunctionalLocations() {
    return functionalLocations;
  }

  /**
  * Set the functionalLocations of this {@link CasePatchUpdateRequest} instance.
  *
  * @param functionalLocations  The functionalLocations of this {@link CasePatchUpdateRequest}
  */
  public void setFunctionalLocations( @Nonnull final List<CaseQueryResponseValueInnerFunctionalLocationsInner> functionalLocations) {
    this.functionalLocations = functionalLocations;
  }

   /**
   * Set the productInstallPoints of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param productInstallPoints  The productInstallPoints of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest productInstallPoints(@Nonnull final List<CaseQueryResponseValueInnerFunctionalLocationsInner> productInstallPoints) {
    this.productInstallPoints = productInstallPoints;
    return this;
  }
  /**
  * Add one ProductInstallPoints instance to this {@link CasePatchUpdateRequest}.
  * @param productInstallPointsItem The ProductInstallPoints that should be added
  * @return The same instance of type {@link CasePatchUpdateRequest}
  */
  @Nonnull public CasePatchUpdateRequest addProductInstallPointsItem( @Nonnull final CaseQueryResponseValueInnerFunctionalLocationsInner productInstallPointsItem) {
    if (this.productInstallPoints == null) {
      this.productInstallPoints = new ArrayList<>();
    }
    this.productInstallPoints.add(productInstallPointsItem);
    return this;
  }

   /**
   * Get productInstallPoints
   * @return productInstallPoints  The productInstallPoints of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public List<CaseQueryResponseValueInnerFunctionalLocationsInner> getProductInstallPoints() {
    return productInstallPoints;
  }

  /**
  * Set the productInstallPoints of this {@link CasePatchUpdateRequest} instance.
  *
  * @param productInstallPoints  The productInstallPoints of this {@link CasePatchUpdateRequest}
  */
  public void setProductInstallPoints( @Nonnull final List<CaseQueryResponseValueInnerFunctionalLocationsInner> productInstallPoints) {
    this.productInstallPoints = productInstallPoints;
  }

   /**
   * Set the installedBases of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param installedBases  The installedBases of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest installedBases(@Nonnull final List<CaseQueryResponseValueInnerFunctionalLocationsInner> installedBases) {
    this.installedBases = installedBases;
    return this;
  }
  /**
  * Add one InstalledBases instance to this {@link CasePatchUpdateRequest}.
  * @param installedBasesItem The InstalledBases that should be added
  * @return The same instance of type {@link CasePatchUpdateRequest}
  */
  @Nonnull public CasePatchUpdateRequest addInstalledBasesItem( @Nonnull final CaseQueryResponseValueInnerFunctionalLocationsInner installedBasesItem) {
    if (this.installedBases == null) {
      this.installedBases = new ArrayList<>();
    }
    this.installedBases.add(installedBasesItem);
    return this;
  }

   /**
   * Get installedBases
   * @return installedBases  The installedBases of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public List<CaseQueryResponseValueInnerFunctionalLocationsInner> getInstalledBases() {
    return installedBases;
  }

  /**
  * Set the installedBases of this {@link CasePatchUpdateRequest} instance.
  *
  * @param installedBases  The installedBases of this {@link CasePatchUpdateRequest}
  */
  public void setInstalledBases( @Nonnull final List<CaseQueryResponseValueInnerFunctionalLocationsInner> installedBases) {
    this.installedBases = installedBases;
  }

   /**
   * Set the account of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param account  The account of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest account(@Nonnull final CaseQueryResponseValueInnerAccount account) {
    this.account = account;
    return this;
  }

   /**
   * Get account
   * @return account  The account of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public CaseQueryResponseValueInnerAccount getAccount() {
    return account;
  }

  /**
  * Set the account of this {@link CasePatchUpdateRequest} instance.
  *
  * @param account  The account of this {@link CasePatchUpdateRequest}
  */
  public void setAccount( @Nonnull final CaseQueryResponseValueInnerAccount account) {
    this.account = account;
  }

   /**
   * Set the contact of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param contact  The contact of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest contact(@Nonnull final CaseQueryResponseValueInnerContact contact) {
    this.contact = contact;
    return this;
  }

   /**
   * Get contact
   * @return contact  The contact of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public CaseQueryResponseValueInnerContact getContact() {
    return contact;
  }

  /**
  * Set the contact of this {@link CasePatchUpdateRequest} instance.
  *
  * @param contact  The contact of this {@link CasePatchUpdateRequest}
  */
  public void setContact( @Nonnull final CaseQueryResponseValueInnerContact contact) {
    this.contact = contact;
  }

   /**
   * Set the individualCustomer of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param individualCustomer  The individualCustomer of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest individualCustomer(@Nonnull final CaseQueryResponseValueInnerIndividualCustomer individualCustomer) {
    this.individualCustomer = individualCustomer;
    return this;
  }

   /**
   * Get individualCustomer
   * @return individualCustomer  The individualCustomer of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public CaseQueryResponseValueInnerIndividualCustomer getIndividualCustomer() {
    return individualCustomer;
  }

  /**
  * Set the individualCustomer of this {@link CasePatchUpdateRequest} instance.
  *
  * @param individualCustomer  The individualCustomer of this {@link CasePatchUpdateRequest}
  */
  public void setIndividualCustomer( @Nonnull final CaseQueryResponseValueInnerIndividualCustomer individualCustomer) {
    this.individualCustomer = individualCustomer;
  }

   /**
   * Set the processor of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param processor  The processor of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest processor(@Nonnull final CaseQueryResponseValueInnerIndividualCustomer processor) {
    this.processor = processor;
    return this;
  }

   /**
   * Get processor
   * @return processor  The processor of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public CaseQueryResponseValueInnerIndividualCustomer getProcessor() {
    return processor;
  }

  /**
  * Set the processor of this {@link CasePatchUpdateRequest} instance.
  *
  * @param processor  The processor of this {@link CasePatchUpdateRequest}
  */
  public void setProcessor( @Nonnull final CaseQueryResponseValueInnerIndividualCustomer processor) {
    this.processor = processor;
  }

   /**
   * Set the approvers of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param approvers  The approvers of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest approvers(@Nonnull final List<CaseQueryResponseValueInnerIndividualCustomer> approvers) {
    this.approvers = approvers;
    return this;
  }
  /**
  * Add one Approvers instance to this {@link CasePatchUpdateRequest}.
  * @param approversItem The Approvers that should be added
  * @return The same instance of type {@link CasePatchUpdateRequest}
  */
  @Nonnull public CasePatchUpdateRequest addApproversItem( @Nonnull final CaseQueryResponseValueInnerIndividualCustomer approversItem) {
    if (this.approvers == null) {
      this.approvers = new ArrayList<>();
    }
    this.approvers.add(approversItem);
    return this;
  }

   /**
   * Get approvers
   * @return approvers  The approvers of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public List<CaseQueryResponseValueInnerIndividualCustomer> getApprovers() {
    return approvers;
  }

  /**
  * Set the approvers of this {@link CasePatchUpdateRequest} instance.
  *
  * @param approvers  The approvers of this {@link CasePatchUpdateRequest}
  */
  public void setApprovers( @Nonnull final List<CaseQueryResponseValueInnerIndividualCustomer> approvers) {
    this.approvers = approvers;
  }

   /**
   * Set the serviceTeam of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param serviceTeam  The serviceTeam of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest serviceTeam(@Nonnull final CaseQueryResponseValueInnerServiceTeam serviceTeam) {
    this.serviceTeam = serviceTeam;
    return this;
  }

   /**
   * Get serviceTeam
   * @return serviceTeam  The serviceTeam of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public CaseQueryResponseValueInnerServiceTeam getServiceTeam() {
    return serviceTeam;
  }

  /**
  * Set the serviceTeam of this {@link CasePatchUpdateRequest} instance.
  *
  * @param serviceTeam  The serviceTeam of this {@link CasePatchUpdateRequest}
  */
  public void setServiceTeam( @Nonnull final CaseQueryResponseValueInnerServiceTeam serviceTeam) {
    this.serviceTeam = serviceTeam;
  }

   /**
   * Set the description of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param description  The description of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest description(@Nonnull final CaseQueryResponseValueInnerDescription description) {
    this.description = description;
    return this;
  }

   /**
   * Get description
   * @return description  The description of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public CaseQueryResponseValueInnerDescription getDescription() {
    return description;
  }

  /**
  * Set the description of this {@link CasePatchUpdateRequest} instance.
  *
  * @param description  The description of this {@link CasePatchUpdateRequest}
  */
  public void setDescription( @Nonnull final CaseQueryResponseValueInnerDescription description) {
    this.description = description;
  }

   /**
   * Set the notes of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param notes  The notes of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest notes(@Nonnull final List<CaseQueryResponseValueInnerNotesInner> notes) {
    this.notes = notes;
    return this;
  }
  /**
  * Add one Notes instance to this {@link CasePatchUpdateRequest}.
  * @param notesItem The Notes that should be added
  * @return The same instance of type {@link CasePatchUpdateRequest}
  */
  @Nonnull public CasePatchUpdateRequest addNotesItem( @Nonnull final CaseQueryResponseValueInnerNotesInner notesItem) {
    if (this.notes == null) {
      this.notes = new ArrayList<>();
    }
    this.notes.add(notesItem);
    return this;
  }

   /**
   * Get notes
   * @return notes  The notes of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public List<CaseQueryResponseValueInnerNotesInner> getNotes() {
    return notes;
  }

  /**
  * Set the notes of this {@link CasePatchUpdateRequest} instance.
  *
  * @param notes  The notes of this {@link CasePatchUpdateRequest}
  */
  public void setNotes( @Nonnull final List<CaseQueryResponseValueInnerNotesInner> notes) {
    this.notes = notes;
  }

   /**
   * Set the timePoints of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param timePoints  The timePoints of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest timePoints(@Nonnull final CaseReadResponseValueTimePoints timePoints) {
    this.timePoints = timePoints;
    return this;
  }

   /**
   * Get timePoints
   * @return timePoints  The timePoints of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public CaseReadResponseValueTimePoints getTimePoints() {
    return timePoints;
  }

  /**
  * Set the timePoints of this {@link CasePatchUpdateRequest} instance.
  *
  * @param timePoints  The timePoints of this {@link CasePatchUpdateRequest}
  */
  public void setTimePoints( @Nonnull final CaseReadResponseValueTimePoints timePoints) {
    this.timePoints = timePoints;
  }

   /**
   * Set the categoryLevel1 of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param categoryLevel1  The categoryLevel1 of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest categoryLevel1(@Nonnull final CaseQueryResponseValueInnerFunctionalLocationsInner categoryLevel1) {
    this.categoryLevel1 = categoryLevel1;
    return this;
  }

   /**
   * Get categoryLevel1
   * @return categoryLevel1  The categoryLevel1 of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public CaseQueryResponseValueInnerFunctionalLocationsInner getCategoryLevel1() {
    return categoryLevel1;
  }

  /**
  * Set the categoryLevel1 of this {@link CasePatchUpdateRequest} instance.
  *
  * @param categoryLevel1  The categoryLevel1 of this {@link CasePatchUpdateRequest}
  */
  public void setCategoryLevel1( @Nonnull final CaseQueryResponseValueInnerFunctionalLocationsInner categoryLevel1) {
    this.categoryLevel1 = categoryLevel1;
  }

   /**
   * Set the categoryLevel2 of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param categoryLevel2  The categoryLevel2 of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest categoryLevel2(@Nonnull final CaseQueryResponseValueInnerFunctionalLocationsInner categoryLevel2) {
    this.categoryLevel2 = categoryLevel2;
    return this;
  }

   /**
   * Get categoryLevel2
   * @return categoryLevel2  The categoryLevel2 of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public CaseQueryResponseValueInnerFunctionalLocationsInner getCategoryLevel2() {
    return categoryLevel2;
  }

  /**
  * Set the categoryLevel2 of this {@link CasePatchUpdateRequest} instance.
  *
  * @param categoryLevel2  The categoryLevel2 of this {@link CasePatchUpdateRequest}
  */
  public void setCategoryLevel2( @Nonnull final CaseQueryResponseValueInnerFunctionalLocationsInner categoryLevel2) {
    this.categoryLevel2 = categoryLevel2;
  }

   /**
   * Set the extensions of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param extensions  The extensions of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest extensions(@Nonnull final Object extensions) {
    this.extensions = extensions;
    return this;
  }

   /**
   * Get extensions
   * @return extensions  The extensions of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public Object getExtensions() {
    return extensions;
  }

  /**
  * Set the extensions of this {@link CasePatchUpdateRequest} instance.
  *
  * @param extensions  The extensions of this {@link CasePatchUpdateRequest}
  */
  public void setExtensions( @Nonnull final Object extensions) {
    this.extensions = extensions;
  }

   /**
   * Set the attachments of this {@link CasePatchUpdateRequest} instance and return the same instance.
   *
   * @param attachments  The attachments of this {@link CasePatchUpdateRequest}
   * @return The same instance of this {@link CasePatchUpdateRequest} class
   */
   @Nonnull public CasePatchUpdateRequest attachments(@Nonnull final List<CaseUpdateRequestAttachmentsInner> attachments) {
    this.attachments = attachments;
    return this;
  }
  /**
  * Add one Attachments instance to this {@link CasePatchUpdateRequest}.
  * @param attachmentsItem The Attachments that should be added
  * @return The same instance of type {@link CasePatchUpdateRequest}
  */
  @Nonnull public CasePatchUpdateRequest addAttachmentsItem( @Nonnull final CaseUpdateRequestAttachmentsInner attachmentsItem) {
    if (this.attachments == null) {
      this.attachments = new ArrayList<>();
    }
    this.attachments.add(attachmentsItem);
    return this;
  }

   /**
   * Get attachments
   * @return attachments  The attachments of this {@link CasePatchUpdateRequest} instance.
  **/
  @Nonnull public List<CaseUpdateRequestAttachmentsInner> getAttachments() {
    return attachments;
  }

  /**
  * Set the attachments of this {@link CasePatchUpdateRequest} instance.
  *
  * @param attachments  The attachments of this {@link CasePatchUpdateRequest}
  */
  public void setAttachments( @Nonnull final List<CaseUpdateRequestAttachmentsInner> attachments) {
    this.attachments = attachments;
  }

  /**
   * Get the names of the unrecognizable properties of the {@link CasePatchUpdateRequest}.
   * @return The set of properties names
   */
  @Nonnull
  public Set<String> getCustomFieldNames() {
    return cloudSdkCustomFields.keySet();
  }

  /**
   * Get the value of an unrecognizable property of the {@link CasePatchUpdateRequest}.
   * @param name  The name of the property
   * @return The value of the property
   * @throws NoSuchElementException  If no property with the given name could be found.
   */
  @Nullable
  public Object getCustomField(@Nonnull final String name) throws NoSuchElementException {
    if( !cloudSdkCustomFields.containsKey(name) ) {
        throw new NoSuchElementException("CasePatchUpdateRequest has no field with name '" + name + "'.");
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
    final CasePatchUpdateRequest casePatchUpdateRequest = (CasePatchUpdateRequest) o;
    return Objects.equals(this.cloudSdkCustomFields, casePatchUpdateRequest.cloudSdkCustomFields) &&
        Objects.equals(this.subject, casePatchUpdateRequest.subject) &&
        Objects.equals(this.priority, casePatchUpdateRequest.priority) &&
        Objects.equals(this.status, casePatchUpdateRequest.status) &&
        Objects.equals(this.escalationStatus, casePatchUpdateRequest.escalationStatus) &&
        Objects.equals(this.registeredProducts, casePatchUpdateRequest.registeredProducts) &&
        Objects.equals(this.functionalLocations, casePatchUpdateRequest.functionalLocations) &&
        Objects.equals(this.productInstallPoints, casePatchUpdateRequest.productInstallPoints) &&
        Objects.equals(this.installedBases, casePatchUpdateRequest.installedBases) &&
        Objects.equals(this.account, casePatchUpdateRequest.account) &&
        Objects.equals(this.contact, casePatchUpdateRequest.contact) &&
        Objects.equals(this.individualCustomer, casePatchUpdateRequest.individualCustomer) &&
        Objects.equals(this.processor, casePatchUpdateRequest.processor) &&
        Objects.equals(this.approvers, casePatchUpdateRequest.approvers) &&
        Objects.equals(this.serviceTeam, casePatchUpdateRequest.serviceTeam) &&
        Objects.equals(this.description, casePatchUpdateRequest.description) &&
        Objects.equals(this.notes, casePatchUpdateRequest.notes) &&
        Objects.equals(this.timePoints, casePatchUpdateRequest.timePoints) &&
        Objects.equals(this.categoryLevel1, casePatchUpdateRequest.categoryLevel1) &&
        Objects.equals(this.categoryLevel2, casePatchUpdateRequest.categoryLevel2) &&
        Objects.equals(this.extensions, casePatchUpdateRequest.extensions) &&
        Objects.equals(this.attachments, casePatchUpdateRequest.attachments);
  }

  @Override
  public int hashCode() {
    return Objects.hash(subject, priority, status, escalationStatus, registeredProducts, functionalLocations, productInstallPoints, installedBases, account, contact, individualCustomer, processor, approvers, serviceTeam, description, notes, timePoints, categoryLevel1, categoryLevel2, extensions, attachments, cloudSdkCustomFields);
  }

  @Override
  @Nonnull public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("class CasePatchUpdateRequest {\n");
    sb.append("    subject: ").append(toIndentedString(subject)).append("\n");
    sb.append("    priority: ").append(toIndentedString(priority)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("    escalationStatus: ").append(toIndentedString(escalationStatus)).append("\n");
    sb.append("    registeredProducts: ").append(toIndentedString(registeredProducts)).append("\n");
    sb.append("    functionalLocations: ").append(toIndentedString(functionalLocations)).append("\n");
    sb.append("    productInstallPoints: ").append(toIndentedString(productInstallPoints)).append("\n");
    sb.append("    installedBases: ").append(toIndentedString(installedBases)).append("\n");
    sb.append("    account: ").append(toIndentedString(account)).append("\n");
    sb.append("    contact: ").append(toIndentedString(contact)).append("\n");
    sb.append("    individualCustomer: ").append(toIndentedString(individualCustomer)).append("\n");
    sb.append("    processor: ").append(toIndentedString(processor)).append("\n");
    sb.append("    approvers: ").append(toIndentedString(approvers)).append("\n");
    sb.append("    serviceTeam: ").append(toIndentedString(serviceTeam)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    notes: ").append(toIndentedString(notes)).append("\n");
    sb.append("    timePoints: ").append(toIndentedString(timePoints)).append("\n");
    sb.append("    categoryLevel1: ").append(toIndentedString(categoryLevel1)).append("\n");
    sb.append("    categoryLevel2: ").append(toIndentedString(categoryLevel2)).append("\n");
    sb.append("    extensions: ").append(toIndentedString(extensions)).append("\n");
    sb.append("    attachments: ").append(toIndentedString(attachments)).append("\n");
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
