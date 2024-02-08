

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
import com.sap.cnsmodules.individualCustomer.model.IndividualCustomerReadResponseInfo;
import com.sap.cnsmodules.individualCustomer.model.IndividualCustomerReadResponseValue;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * IndividualCustomerReadResponse
 */

// CHECKSTYLE:OFF
public class IndividualCustomerReadResponse 
// CHECKSTYLE:ON
{
  @JsonProperty("value")
  private IndividualCustomerReadResponseValue value;

  @JsonProperty("info")
  private IndividualCustomerReadResponseInfo info;

  @JsonAnySetter
  private final Map<String, Object> cloudSdkCustomFields = new LinkedHashMap<>();

   /**
   * Set the value of this {@link IndividualCustomerReadResponse} instance and return the same instance.
   *
   * @param value  The value of this {@link IndividualCustomerReadResponse}
   * @return The same instance of this {@link IndividualCustomerReadResponse} class
   */
   @Nonnull public IndividualCustomerReadResponse value(@Nonnull final IndividualCustomerReadResponseValue value) {
    this.value = value;
    return this;
  }

   /**
   * Get value
   * @return value  The value of this {@link IndividualCustomerReadResponse} instance.
  **/
  @Nonnull public IndividualCustomerReadResponseValue getValue() {
    return value;
  }

  /**
  * Set the value of this {@link IndividualCustomerReadResponse} instance.
  *
  * @param value  The value of this {@link IndividualCustomerReadResponse}
  */
  public void setValue( @Nonnull final IndividualCustomerReadResponseValue value) {
    this.value = value;
  }

   /**
   * Set the info of this {@link IndividualCustomerReadResponse} instance and return the same instance.
   *
   * @param info  The info of this {@link IndividualCustomerReadResponse}
   * @return The same instance of this {@link IndividualCustomerReadResponse} class
   */
   @Nonnull public IndividualCustomerReadResponse info(@Nonnull final IndividualCustomerReadResponseInfo info) {
    this.info = info;
    return this;
  }

   /**
   * Get info
   * @return info  The info of this {@link IndividualCustomerReadResponse} instance.
  **/
  @Nonnull public IndividualCustomerReadResponseInfo getInfo() {
    return info;
  }

  /**
  * Set the info of this {@link IndividualCustomerReadResponse} instance.
  *
  * @param info  The info of this {@link IndividualCustomerReadResponse}
  */
  public void setInfo( @Nonnull final IndividualCustomerReadResponseInfo info) {
    this.info = info;
  }

  /**
   * Get the names of the unrecognizable properties of the {@link IndividualCustomerReadResponse}.
   * @return The set of properties names
   */
  @Nonnull
  public Set<String> getCustomFieldNames() {
    return cloudSdkCustomFields.keySet();
  }

  /**
   * Get the value of an unrecognizable property of the {@link IndividualCustomerReadResponse}.
   * @param name  The name of the property
   * @return The value of the property
   * @throws NoSuchElementException  If no property with the given name could be found.
   */
  @Nullable
  public Object getCustomField(@Nonnull final String name) throws NoSuchElementException {
    if( !cloudSdkCustomFields.containsKey(name) ) {
        throw new NoSuchElementException("IndividualCustomerReadResponse has no field with name '" + name + "'.");
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
    final IndividualCustomerReadResponse individualCustomerReadResponse = (IndividualCustomerReadResponse) o;
    return Objects.equals(this.cloudSdkCustomFields, individualCustomerReadResponse.cloudSdkCustomFields) &&
        Objects.equals(this.value, individualCustomerReadResponse.value) &&
        Objects.equals(this.info, individualCustomerReadResponse.info);
  }

  @Override
  public int hashCode() {
    return Objects.hash(value, info, cloudSdkCustomFields);
  }

  @Override
  @Nonnull public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("class IndividualCustomerReadResponse {\n");
    sb.append("    value: ").append(toIndentedString(value)).append("\n");
    sb.append("    info: ").append(toIndentedString(info)).append("\n");
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

