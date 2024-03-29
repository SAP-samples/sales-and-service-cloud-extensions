

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
import java.util.UUID;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * CaseQueryResponseValueInnerIndividualCustomer
 */

// CHECKSTYLE:OFF
public class CaseQueryResponseValueInnerIndividualCustomer 
// CHECKSTYLE:ON
{
  @JsonProperty("id")
  private UUID id;

  @JsonProperty("displayId")
  private String displayId;

  @JsonProperty("name")
  private String name;

  @JsonProperty("emailId")
  private String emailId;

  @JsonAnySetter
  private final Map<String, Object> cloudSdkCustomFields = new LinkedHashMap<>();

   /**
   * Set the id of this {@link CaseQueryResponseValueInnerIndividualCustomer} instance and return the same instance.
   *
   * @param id  The id of this {@link CaseQueryResponseValueInnerIndividualCustomer}
   * @return The same instance of this {@link CaseQueryResponseValueInnerIndividualCustomer} class
   */
   @Nonnull public CaseQueryResponseValueInnerIndividualCustomer id(@Nonnull final UUID id) {
    this.id = id;
    return this;
  }

   /**
   * Get id
   * @return id  The id of this {@link CaseQueryResponseValueInnerIndividualCustomer} instance.
  **/
  @Nonnull public UUID getId() {
    return id;
  }

  /**
  * Set the id of this {@link CaseQueryResponseValueInnerIndividualCustomer} instance.
  *
  * @param id  The id of this {@link CaseQueryResponseValueInnerIndividualCustomer}
  */
  public void setId( @Nonnull final UUID id) {
    this.id = id;
  }

   /**
   * Set the displayId of this {@link CaseQueryResponseValueInnerIndividualCustomer} instance and return the same instance.
   *
   * @param displayId  The displayId of this {@link CaseQueryResponseValueInnerIndividualCustomer}
   * @return The same instance of this {@link CaseQueryResponseValueInnerIndividualCustomer} class
   */
   @Nonnull public CaseQueryResponseValueInnerIndividualCustomer displayId(@Nonnull final String displayId) {
    this.displayId = displayId;
    return this;
  }

   /**
   * Get displayId
   * @return displayId  The displayId of this {@link CaseQueryResponseValueInnerIndividualCustomer} instance.
  **/
  @Nonnull public String getDisplayId() {
    return displayId;
  }

  /**
  * Set the displayId of this {@link CaseQueryResponseValueInnerIndividualCustomer} instance.
  *
  * @param displayId  The displayId of this {@link CaseQueryResponseValueInnerIndividualCustomer}
  */
  public void setDisplayId( @Nonnull final String displayId) {
    this.displayId = displayId;
  }

   /**
   * Set the name of this {@link CaseQueryResponseValueInnerIndividualCustomer} instance and return the same instance.
   *
   * @param name  The name of this {@link CaseQueryResponseValueInnerIndividualCustomer}
   * @return The same instance of this {@link CaseQueryResponseValueInnerIndividualCustomer} class
   */
   @Nonnull public CaseQueryResponseValueInnerIndividualCustomer name(@Nonnull final String name) {
    this.name = name;
    return this;
  }

   /**
   * Get name
   * @return name  The name of this {@link CaseQueryResponseValueInnerIndividualCustomer} instance.
  **/
  @Nonnull public String getName() {
    return name;
  }

  /**
  * Set the name of this {@link CaseQueryResponseValueInnerIndividualCustomer} instance.
  *
  * @param name  The name of this {@link CaseQueryResponseValueInnerIndividualCustomer}
  */
  public void setName( @Nonnull final String name) {
    this.name = name;
  }

   /**
   * Set the emailId of this {@link CaseQueryResponseValueInnerIndividualCustomer} instance and return the same instance.
   *
   * @param emailId  The emailId of this {@link CaseQueryResponseValueInnerIndividualCustomer}
   * @return The same instance of this {@link CaseQueryResponseValueInnerIndividualCustomer} class
   */
   @Nonnull public CaseQueryResponseValueInnerIndividualCustomer emailId(@Nonnull final String emailId) {
    this.emailId = emailId;
    return this;
  }

   /**
   * Get emailId
   * @return emailId  The emailId of this {@link CaseQueryResponseValueInnerIndividualCustomer} instance.
  **/
  @Nonnull public String getEmailId() {
    return emailId;
  }

  /**
  * Set the emailId of this {@link CaseQueryResponseValueInnerIndividualCustomer} instance.
  *
  * @param emailId  The emailId of this {@link CaseQueryResponseValueInnerIndividualCustomer}
  */
  public void setEmailId( @Nonnull final String emailId) {
    this.emailId = emailId;
  }

  /**
   * Get the names of the unrecognizable properties of the {@link CaseQueryResponseValueInnerIndividualCustomer}.
   * @return The set of properties names
   */
  @Nonnull
  public Set<String> getCustomFieldNames() {
    return cloudSdkCustomFields.keySet();
  }

  /**
   * Get the value of an unrecognizable property of the {@link CaseQueryResponseValueInnerIndividualCustomer}.
   * @param name  The name of the property
   * @return The value of the property
   * @throws NoSuchElementException  If no property with the given name could be found.
   */
  @Nullable
  public Object getCustomField(@Nonnull final String name) throws NoSuchElementException {
    if( !cloudSdkCustomFields.containsKey(name) ) {
        throw new NoSuchElementException("CaseQueryResponseValueInnerIndividualCustomer has no field with name '" + name + "'.");
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
    final CaseQueryResponseValueInnerIndividualCustomer caseQueryResponseValueInnerIndividualCustomer = (CaseQueryResponseValueInnerIndividualCustomer) o;
    return Objects.equals(this.cloudSdkCustomFields, caseQueryResponseValueInnerIndividualCustomer.cloudSdkCustomFields) &&
        Objects.equals(this.id, caseQueryResponseValueInnerIndividualCustomer.id) &&
        Objects.equals(this.displayId, caseQueryResponseValueInnerIndividualCustomer.displayId) &&
        Objects.equals(this.name, caseQueryResponseValueInnerIndividualCustomer.name) &&
        Objects.equals(this.emailId, caseQueryResponseValueInnerIndividualCustomer.emailId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, displayId, name, emailId, cloudSdkCustomFields);
  }

  @Override
  @Nonnull public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("class CaseQueryResponseValueInnerIndividualCustomer {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    displayId: ").append(toIndentedString(displayId)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    emailId: ").append(toIndentedString(emailId)).append("\n");
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

