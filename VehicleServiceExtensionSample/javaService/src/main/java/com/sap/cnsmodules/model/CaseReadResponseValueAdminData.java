

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
 * CaseReadResponseValueAdminData
 */

// CHECKSTYLE:OFF
public class CaseReadResponseValueAdminData 
// CHECKSTYLE:ON
{
  @JsonProperty("createdBy")
  private UUID createdBy;

  @JsonProperty("createdByName")
  private String createdByName;

  @JsonProperty("createdOn")
  private String createdOn;

  @JsonProperty("updatedBy")
  private UUID updatedBy;

  @JsonProperty("updatedByName")
  private String updatedByName;

  @JsonProperty("updatedOn")
  private String updatedOn;

  @JsonAnySetter
  private final Map<String, Object> cloudSdkCustomFields = new LinkedHashMap<>();

   /**
   * Set the createdBy of this {@link CaseReadResponseValueAdminData} instance and return the same instance.
   *
   * @param createdBy  The createdBy of this {@link CaseReadResponseValueAdminData}
   * @return The same instance of this {@link CaseReadResponseValueAdminData} class
   */
   @Nonnull public CaseReadResponseValueAdminData createdBy(@Nonnull final UUID createdBy) {
    this.createdBy = createdBy;
    return this;
  }

   /**
   * Get createdBy
   * @return createdBy  The createdBy of this {@link CaseReadResponseValueAdminData} instance.
  **/
  @Nonnull public UUID getCreatedBy() {
    return createdBy;
  }

  /**
  * Set the createdBy of this {@link CaseReadResponseValueAdminData} instance.
  *
  * @param createdBy  The createdBy of this {@link CaseReadResponseValueAdminData}
  */
  public void setCreatedBy( @Nonnull final UUID createdBy) {
    this.createdBy = createdBy;
  }

   /**
   * Set the createdByName of this {@link CaseReadResponseValueAdminData} instance and return the same instance.
   *
   * @param createdByName  The createdByName of this {@link CaseReadResponseValueAdminData}
   * @return The same instance of this {@link CaseReadResponseValueAdminData} class
   */
   @Nonnull public CaseReadResponseValueAdminData createdByName(@Nonnull final String createdByName) {
    this.createdByName = createdByName;
    return this;
  }

   /**
   * Get createdByName
   * @return createdByName  The createdByName of this {@link CaseReadResponseValueAdminData} instance.
  **/
  @Nonnull public String getCreatedByName() {
    return createdByName;
  }

  /**
  * Set the createdByName of this {@link CaseReadResponseValueAdminData} instance.
  *
  * @param createdByName  The createdByName of this {@link CaseReadResponseValueAdminData}
  */
  public void setCreatedByName( @Nonnull final String createdByName) {
    this.createdByName = createdByName;
  }

   /**
   * Set the createdOn of this {@link CaseReadResponseValueAdminData} instance and return the same instance.
   *
   * @param createdOn  The createdOn of this {@link CaseReadResponseValueAdminData}
   * @return The same instance of this {@link CaseReadResponseValueAdminData} class
   */
   @Nonnull public CaseReadResponseValueAdminData createdOn(@Nonnull final String createdOn) {
    this.createdOn = createdOn;
    return this;
  }

   /**
   * Get createdOn
   * @return createdOn  The createdOn of this {@link CaseReadResponseValueAdminData} instance.
  **/
  @Nonnull public String getCreatedOn() {
    return createdOn;
  }

  /**
  * Set the createdOn of this {@link CaseReadResponseValueAdminData} instance.
  *
  * @param createdOn  The createdOn of this {@link CaseReadResponseValueAdminData}
  */
  public void setCreatedOn( @Nonnull final String createdOn) {
    this.createdOn = createdOn;
  }

   /**
   * Set the updatedBy of this {@link CaseReadResponseValueAdminData} instance and return the same instance.
   *
   * @param updatedBy  The updatedBy of this {@link CaseReadResponseValueAdminData}
   * @return The same instance of this {@link CaseReadResponseValueAdminData} class
   */
   @Nonnull public CaseReadResponseValueAdminData updatedBy(@Nonnull final UUID updatedBy) {
    this.updatedBy = updatedBy;
    return this;
  }

   /**
   * Get updatedBy
   * @return updatedBy  The updatedBy of this {@link CaseReadResponseValueAdminData} instance.
  **/
  @Nonnull public UUID getUpdatedBy() {
    return updatedBy;
  }

  /**
  * Set the updatedBy of this {@link CaseReadResponseValueAdminData} instance.
  *
  * @param updatedBy  The updatedBy of this {@link CaseReadResponseValueAdminData}
  */
  public void setUpdatedBy( @Nonnull final UUID updatedBy) {
    this.updatedBy = updatedBy;
  }

   /**
   * Set the updatedByName of this {@link CaseReadResponseValueAdminData} instance and return the same instance.
   *
   * @param updatedByName  The updatedByName of this {@link CaseReadResponseValueAdminData}
   * @return The same instance of this {@link CaseReadResponseValueAdminData} class
   */
   @Nonnull public CaseReadResponseValueAdminData updatedByName(@Nonnull final String updatedByName) {
    this.updatedByName = updatedByName;
    return this;
  }

   /**
   * Get updatedByName
   * @return updatedByName  The updatedByName of this {@link CaseReadResponseValueAdminData} instance.
  **/
  @Nonnull public String getUpdatedByName() {
    return updatedByName;
  }

  /**
  * Set the updatedByName of this {@link CaseReadResponseValueAdminData} instance.
  *
  * @param updatedByName  The updatedByName of this {@link CaseReadResponseValueAdminData}
  */
  public void setUpdatedByName( @Nonnull final String updatedByName) {
    this.updatedByName = updatedByName;
  }

   /**
   * Set the updatedOn of this {@link CaseReadResponseValueAdminData} instance and return the same instance.
   *
   * @param updatedOn  The updatedOn of this {@link CaseReadResponseValueAdminData}
   * @return The same instance of this {@link CaseReadResponseValueAdminData} class
   */
   @Nonnull public CaseReadResponseValueAdminData updatedOn(@Nonnull final String updatedOn) {
    this.updatedOn = updatedOn;
    return this;
  }

   /**
   * Get updatedOn
   * @return updatedOn  The updatedOn of this {@link CaseReadResponseValueAdminData} instance.
  **/
  @Nonnull public String getUpdatedOn() {
    return updatedOn;
  }

  /**
  * Set the updatedOn of this {@link CaseReadResponseValueAdminData} instance.
  *
  * @param updatedOn  The updatedOn of this {@link CaseReadResponseValueAdminData}
  */
  public void setUpdatedOn( @Nonnull final String updatedOn) {
    this.updatedOn = updatedOn;
  }

  /**
   * Get the names of the unrecognizable properties of the {@link CaseReadResponseValueAdminData}.
   * @return The set of properties names
   */
  @Nonnull
  public Set<String> getCustomFieldNames() {
    return cloudSdkCustomFields.keySet();
  }

  /**
   * Get the value of an unrecognizable property of the {@link CaseReadResponseValueAdminData}.
   * @param name  The name of the property
   * @return The value of the property
   * @throws NoSuchElementException  If no property with the given name could be found.
   */
  @Nullable
  public Object getCustomField(@Nonnull final String name) throws NoSuchElementException {
    if( !cloudSdkCustomFields.containsKey(name) ) {
        throw new NoSuchElementException("CaseReadResponseValueAdminData has no field with name '" + name + "'.");
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
    final CaseReadResponseValueAdminData caseReadResponseValueAdminData = (CaseReadResponseValueAdminData) o;
    return Objects.equals(this.cloudSdkCustomFields, caseReadResponseValueAdminData.cloudSdkCustomFields) &&
        Objects.equals(this.createdBy, caseReadResponseValueAdminData.createdBy) &&
        Objects.equals(this.createdByName, caseReadResponseValueAdminData.createdByName) &&
        Objects.equals(this.createdOn, caseReadResponseValueAdminData.createdOn) &&
        Objects.equals(this.updatedBy, caseReadResponseValueAdminData.updatedBy) &&
        Objects.equals(this.updatedByName, caseReadResponseValueAdminData.updatedByName) &&
        Objects.equals(this.updatedOn, caseReadResponseValueAdminData.updatedOn);
  }

  @Override
  public int hashCode() {
    return Objects.hash(createdBy, createdByName, createdOn, updatedBy, updatedByName, updatedOn, cloudSdkCustomFields);
  }

  @Override
  @Nonnull public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("class CaseReadResponseValueAdminData {\n");
    sb.append("    createdBy: ").append(toIndentedString(createdBy)).append("\n");
    sb.append("    createdByName: ").append(toIndentedString(createdByName)).append("\n");
    sb.append("    createdOn: ").append(toIndentedString(createdOn)).append("\n");
    sb.append("    updatedBy: ").append(toIndentedString(updatedBy)).append("\n");
    sb.append("    updatedByName: ").append(toIndentedString(updatedByName)).append("\n");
    sb.append("    updatedOn: ").append(toIndentedString(updatedOn)).append("\n");
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

