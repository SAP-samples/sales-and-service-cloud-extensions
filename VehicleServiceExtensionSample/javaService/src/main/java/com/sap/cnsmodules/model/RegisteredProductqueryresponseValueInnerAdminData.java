

/*
 * Registered Product Service
 * The registered product is an instance of a product associated with a customer and generally has a serial ID. Registered product contains information describing its physical location, parties involved, such as the customer or employee responsible, product, and warranty.
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
import java.time.OffsetDateTime;
import java.util.UUID;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * RegisteredProductqueryresponseValueInnerAdminData
 */

// CHECKSTYLE:OFF
public class RegisteredProductqueryresponseValueInnerAdminData 
// CHECKSTYLE:ON
{
  @JsonProperty("createdBy")
  private UUID createdBy;

  @JsonProperty("createdByName")
  private String createdByName;

  @JsonProperty("createdOn")
  private OffsetDateTime createdOn;

  @JsonProperty("updatedBy")
  private UUID updatedBy;

  @JsonProperty("updatedByName")
  private String updatedByName;

  @JsonProperty("updatedOn")
  private OffsetDateTime updatedOn;

  @JsonAnySetter
  private final Map<String, Object> cloudSdkCustomFields = new LinkedHashMap<>();

   /**
   * Set the createdBy of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance and return the same instance.
   *
   * @param createdBy  The createdBy of this {@link RegisteredProductqueryresponseValueInnerAdminData}
   * @return The same instance of this {@link RegisteredProductqueryresponseValueInnerAdminData} class
   */
   @Nonnull public RegisteredProductqueryresponseValueInnerAdminData createdBy(@Nonnull final UUID createdBy) {
    this.createdBy = createdBy;
    return this;
  }

   /**
   * Get createdBy
   * @return createdBy  The createdBy of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance.
  **/
  @Nonnull public UUID getCreatedBy() {
    return createdBy;
  }

  /**
  * Set the createdBy of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance.
  *
  * @param createdBy  The createdBy of this {@link RegisteredProductqueryresponseValueInnerAdminData}
  */
  public void setCreatedBy( @Nonnull final UUID createdBy) {
    this.createdBy = createdBy;
  }

   /**
   * Set the createdByName of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance and return the same instance.
   *
   * @param createdByName  The createdByName of this {@link RegisteredProductqueryresponseValueInnerAdminData}
   * @return The same instance of this {@link RegisteredProductqueryresponseValueInnerAdminData} class
   */
   @Nonnull public RegisteredProductqueryresponseValueInnerAdminData createdByName(@Nonnull final String createdByName) {
    this.createdByName = createdByName;
    return this;
  }

   /**
   * Get createdByName
   * @return createdByName  The createdByName of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance.
  **/
  @Nonnull public String getCreatedByName() {
    return createdByName;
  }

  /**
  * Set the createdByName of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance.
  *
  * @param createdByName  The createdByName of this {@link RegisteredProductqueryresponseValueInnerAdminData}
  */
  public void setCreatedByName( @Nonnull final String createdByName) {
    this.createdByName = createdByName;
  }

   /**
   * Set the createdOn of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance and return the same instance.
   *
   * @param createdOn  The createdOn of this {@link RegisteredProductqueryresponseValueInnerAdminData}
   * @return The same instance of this {@link RegisteredProductqueryresponseValueInnerAdminData} class
   */
   @Nonnull public RegisteredProductqueryresponseValueInnerAdminData createdOn(@Nonnull final OffsetDateTime createdOn) {
    this.createdOn = createdOn;
    return this;
  }

   /**
   * Get createdOn
   * @return createdOn  The createdOn of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance.
  **/
  @Nonnull public OffsetDateTime getCreatedOn() {
    return createdOn;
  }

  /**
  * Set the createdOn of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance.
  *
  * @param createdOn  The createdOn of this {@link RegisteredProductqueryresponseValueInnerAdminData}
  */
  public void setCreatedOn( @Nonnull final OffsetDateTime createdOn) {
    this.createdOn = createdOn;
  }

   /**
   * Set the updatedBy of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance and return the same instance.
   *
   * @param updatedBy  The updatedBy of this {@link RegisteredProductqueryresponseValueInnerAdminData}
   * @return The same instance of this {@link RegisteredProductqueryresponseValueInnerAdminData} class
   */
   @Nonnull public RegisteredProductqueryresponseValueInnerAdminData updatedBy(@Nonnull final UUID updatedBy) {
    this.updatedBy = updatedBy;
    return this;
  }

   /**
   * Get updatedBy
   * @return updatedBy  The updatedBy of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance.
  **/
  @Nonnull public UUID getUpdatedBy() {
    return updatedBy;
  }

  /**
  * Set the updatedBy of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance.
  *
  * @param updatedBy  The updatedBy of this {@link RegisteredProductqueryresponseValueInnerAdminData}
  */
  public void setUpdatedBy( @Nonnull final UUID updatedBy) {
    this.updatedBy = updatedBy;
  }

   /**
   * Set the updatedByName of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance and return the same instance.
   *
   * @param updatedByName  The updatedByName of this {@link RegisteredProductqueryresponseValueInnerAdminData}
   * @return The same instance of this {@link RegisteredProductqueryresponseValueInnerAdminData} class
   */
   @Nonnull public RegisteredProductqueryresponseValueInnerAdminData updatedByName(@Nonnull final String updatedByName) {
    this.updatedByName = updatedByName;
    return this;
  }

   /**
   * Get updatedByName
   * @return updatedByName  The updatedByName of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance.
  **/
  @Nonnull public String getUpdatedByName() {
    return updatedByName;
  }

  /**
  * Set the updatedByName of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance.
  *
  * @param updatedByName  The updatedByName of this {@link RegisteredProductqueryresponseValueInnerAdminData}
  */
  public void setUpdatedByName( @Nonnull final String updatedByName) {
    this.updatedByName = updatedByName;
  }

   /**
   * Set the updatedOn of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance and return the same instance.
   *
   * @param updatedOn  The updatedOn of this {@link RegisteredProductqueryresponseValueInnerAdminData}
   * @return The same instance of this {@link RegisteredProductqueryresponseValueInnerAdminData} class
   */
   @Nonnull public RegisteredProductqueryresponseValueInnerAdminData updatedOn(@Nonnull final OffsetDateTime updatedOn) {
    this.updatedOn = updatedOn;
    return this;
  }

   /**
   * Get updatedOn
   * @return updatedOn  The updatedOn of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance.
  **/
  @Nonnull public OffsetDateTime getUpdatedOn() {
    return updatedOn;
  }

  /**
  * Set the updatedOn of this {@link RegisteredProductqueryresponseValueInnerAdminData} instance.
  *
  * @param updatedOn  The updatedOn of this {@link RegisteredProductqueryresponseValueInnerAdminData}
  */
  public void setUpdatedOn( @Nonnull final OffsetDateTime updatedOn) {
    this.updatedOn = updatedOn;
  }

  /**
   * Get the names of the unrecognizable properties of the {@link RegisteredProductqueryresponseValueInnerAdminData}.
   * @return The set of properties names
   */
  @Nonnull
  public Set<String> getCustomFieldNames() {
    return cloudSdkCustomFields.keySet();
  }

  /**
   * Get the value of an unrecognizable property of the {@link RegisteredProductqueryresponseValueInnerAdminData}.
   * @param name  The name of the property
   * @return The value of the property
   * @throws NoSuchElementException  If no property with the given name could be found.
   */
  @Nullable
  public Object getCustomField(@Nonnull final String name) throws NoSuchElementException {
    if( !cloudSdkCustomFields.containsKey(name) ) {
        throw new NoSuchElementException("RegisteredProductqueryresponseValueInnerAdminData has no field with name '" + name + "'.");
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
    final RegisteredProductqueryresponseValueInnerAdminData registeredProductqueryresponseValueInnerAdminData = (RegisteredProductqueryresponseValueInnerAdminData) o;
    return Objects.equals(this.cloudSdkCustomFields, registeredProductqueryresponseValueInnerAdminData.cloudSdkCustomFields) &&
        Objects.equals(this.createdBy, registeredProductqueryresponseValueInnerAdminData.createdBy) &&
        Objects.equals(this.createdByName, registeredProductqueryresponseValueInnerAdminData.createdByName) &&
        Objects.equals(this.createdOn, registeredProductqueryresponseValueInnerAdminData.createdOn) &&
        Objects.equals(this.updatedBy, registeredProductqueryresponseValueInnerAdminData.updatedBy) &&
        Objects.equals(this.updatedByName, registeredProductqueryresponseValueInnerAdminData.updatedByName) &&
        Objects.equals(this.updatedOn, registeredProductqueryresponseValueInnerAdminData.updatedOn);
  }

  @Override
  public int hashCode() {
    return Objects.hash(createdBy, createdByName, createdOn, updatedBy, updatedByName, updatedOn, cloudSdkCustomFields);
  }

  @Override
  @Nonnull public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("class RegisteredProductqueryresponseValueInnerAdminData {\n");
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

