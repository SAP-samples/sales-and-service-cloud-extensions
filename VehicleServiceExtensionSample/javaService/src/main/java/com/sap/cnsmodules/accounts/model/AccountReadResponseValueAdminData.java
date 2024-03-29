

/*
 * Account Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

package com.sap.cnsmodules.accounts.model;

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
 * AccountReadResponseValueAdminData
 */

// CHECKSTYLE:OFF
public class AccountReadResponseValueAdminData 
// CHECKSTYLE:ON
{
  @JsonProperty("createdBy")
  private UUID createdBy;

  @JsonProperty("createdOn")
  private String createdOn;

  @JsonProperty("updatedBy")
  private UUID updatedBy;

  @JsonProperty("updatedOn")
  private String updatedOn;

  @JsonAnySetter
  private final Map<String, Object> cloudSdkCustomFields = new LinkedHashMap<>();

   /**
   * Set the createdBy of this {@link AccountReadResponseValueAdminData} instance and return the same instance.
   *
   * @param createdBy  The createdBy of this {@link AccountReadResponseValueAdminData}
   * @return The same instance of this {@link AccountReadResponseValueAdminData} class
   */
   @Nonnull public AccountReadResponseValueAdminData createdBy(@Nonnull final UUID createdBy) {
    this.createdBy = createdBy;
    return this;
  }

   /**
   * Get createdBy
   * @return createdBy  The createdBy of this {@link AccountReadResponseValueAdminData} instance.
  **/
  @Nonnull public UUID getCreatedBy() {
    return createdBy;
  }

  /**
  * Set the createdBy of this {@link AccountReadResponseValueAdminData} instance.
  *
  * @param createdBy  The createdBy of this {@link AccountReadResponseValueAdminData}
  */
  public void setCreatedBy( @Nonnull final UUID createdBy) {
    this.createdBy = createdBy;
  }

   /**
   * Set the createdOn of this {@link AccountReadResponseValueAdminData} instance and return the same instance.
   *
   * @param createdOn  The createdOn of this {@link AccountReadResponseValueAdminData}
   * @return The same instance of this {@link AccountReadResponseValueAdminData} class
   */
   @Nonnull public AccountReadResponseValueAdminData createdOn(@Nonnull final String createdOn) {
    this.createdOn = createdOn;
    return this;
  }

   /**
   * Get createdOn
   * @return createdOn  The createdOn of this {@link AccountReadResponseValueAdminData} instance.
  **/
  @Nonnull public String getCreatedOn() {
    return createdOn;
  }

  /**
  * Set the createdOn of this {@link AccountReadResponseValueAdminData} instance.
  *
  * @param createdOn  The createdOn of this {@link AccountReadResponseValueAdminData}
  */
  public void setCreatedOn( @Nonnull final String createdOn) {
    this.createdOn = createdOn;
  }

   /**
   * Set the updatedBy of this {@link AccountReadResponseValueAdminData} instance and return the same instance.
   *
   * @param updatedBy  The updatedBy of this {@link AccountReadResponseValueAdminData}
   * @return The same instance of this {@link AccountReadResponseValueAdminData} class
   */
   @Nonnull public AccountReadResponseValueAdminData updatedBy(@Nonnull final UUID updatedBy) {
    this.updatedBy = updatedBy;
    return this;
  }

   /**
   * Get updatedBy
   * @return updatedBy  The updatedBy of this {@link AccountReadResponseValueAdminData} instance.
  **/
  @Nonnull public UUID getUpdatedBy() {
    return updatedBy;
  }

  /**
  * Set the updatedBy of this {@link AccountReadResponseValueAdminData} instance.
  *
  * @param updatedBy  The updatedBy of this {@link AccountReadResponseValueAdminData}
  */
  public void setUpdatedBy( @Nonnull final UUID updatedBy) {
    this.updatedBy = updatedBy;
  }

   /**
   * Set the updatedOn of this {@link AccountReadResponseValueAdminData} instance and return the same instance.
   *
   * @param updatedOn  The updatedOn of this {@link AccountReadResponseValueAdminData}
   * @return The same instance of this {@link AccountReadResponseValueAdminData} class
   */
   @Nonnull public AccountReadResponseValueAdminData updatedOn(@Nonnull final String updatedOn) {
    this.updatedOn = updatedOn;
    return this;
  }

   /**
   * Get updatedOn
   * @return updatedOn  The updatedOn of this {@link AccountReadResponseValueAdminData} instance.
  **/
  @Nonnull public String getUpdatedOn() {
    return updatedOn;
  }

  /**
  * Set the updatedOn of this {@link AccountReadResponseValueAdminData} instance.
  *
  * @param updatedOn  The updatedOn of this {@link AccountReadResponseValueAdminData}
  */
  public void setUpdatedOn( @Nonnull final String updatedOn) {
    this.updatedOn = updatedOn;
  }

  /**
   * Get the names of the unrecognizable properties of the {@link AccountReadResponseValueAdminData}.
   * @return The set of properties names
   */
  @Nonnull
  public Set<String> getCustomFieldNames() {
    return cloudSdkCustomFields.keySet();
  }

  /**
   * Get the value of an unrecognizable property of the {@link AccountReadResponseValueAdminData}.
   * @param name  The name of the property
   * @return The value of the property
   * @throws NoSuchElementException  If no property with the given name could be found.
   */
  @Nullable
  public Object getCustomField(@Nonnull final String name) throws NoSuchElementException {
    if( !cloudSdkCustomFields.containsKey(name) ) {
        throw new NoSuchElementException("AccountReadResponseValueAdminData has no field with name '" + name + "'.");
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
    final AccountReadResponseValueAdminData accountReadResponseValueAdminData = (AccountReadResponseValueAdminData) o;
    return Objects.equals(this.cloudSdkCustomFields, accountReadResponseValueAdminData.cloudSdkCustomFields) &&
        Objects.equals(this.createdBy, accountReadResponseValueAdminData.createdBy) &&
        Objects.equals(this.createdOn, accountReadResponseValueAdminData.createdOn) &&
        Objects.equals(this.updatedBy, accountReadResponseValueAdminData.updatedBy) &&
        Objects.equals(this.updatedOn, accountReadResponseValueAdminData.updatedOn);
  }

  @Override
  public int hashCode() {
    return Objects.hash(createdBy, createdOn, updatedBy, updatedOn, cloudSdkCustomFields);
  }

  @Override
  @Nonnull public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("class AccountReadResponseValueAdminData {\n");
    sb.append("    createdBy: ").append(toIndentedString(createdBy)).append("\n");
    sb.append("    createdOn: ").append(toIndentedString(createdOn)).append("\n");
    sb.append("    updatedBy: ").append(toIndentedString(updatedBy)).append("\n");
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

