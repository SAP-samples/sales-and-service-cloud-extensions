

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
import com.sap.cnsmodules.model.CaseQueryResponseInfo;
import com.sap.cnsmodules.model.CaseQueryResponseValueInner;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * CasePostResponse
 */

// CHECKSTYLE:OFF
public class CasePostResponse 
// CHECKSTYLE:ON
{
  @JsonProperty("value")
  private CaseQueryResponseValueInner value;

  @JsonProperty("info")
  private CaseQueryResponseInfo info;

  @JsonAnySetter
  private final Map<String, Object> cloudSdkCustomFields = new LinkedHashMap<>();

   /**
   * Set the value of this {@link CasePostResponse} instance and return the same instance.
   *
   * @param value  The value of this {@link CasePostResponse}
   * @return The same instance of this {@link CasePostResponse} class
   */
   @Nonnull public CasePostResponse value(@Nonnull final CaseQueryResponseValueInner value) {
    this.value = value;
    return this;
  }

   /**
   * Get value
   * @return value  The value of this {@link CasePostResponse} instance.
  **/
  @Nonnull public CaseQueryResponseValueInner getValue() {
    return value;
  }

  /**
  * Set the value of this {@link CasePostResponse} instance.
  *
  * @param value  The value of this {@link CasePostResponse}
  */
  public void setValue( @Nonnull final CaseQueryResponseValueInner value) {
    this.value = value;
  }

   /**
   * Set the info of this {@link CasePostResponse} instance and return the same instance.
   *
   * @param info  The info of this {@link CasePostResponse}
   * @return The same instance of this {@link CasePostResponse} class
   */
   @Nonnull public CasePostResponse info(@Nonnull final CaseQueryResponseInfo info) {
    this.info = info;
    return this;
  }

   /**
   * Get info
   * @return info  The info of this {@link CasePostResponse} instance.
  **/
  @Nonnull public CaseQueryResponseInfo getInfo() {
    return info;
  }

  /**
  * Set the info of this {@link CasePostResponse} instance.
  *
  * @param info  The info of this {@link CasePostResponse}
  */
  public void setInfo( @Nonnull final CaseQueryResponseInfo info) {
    this.info = info;
  }

  /**
   * Get the names of the unrecognizable properties of the {@link CasePostResponse}.
   * @return The set of properties names
   */
  @Nonnull
  public Set<String> getCustomFieldNames() {
    return cloudSdkCustomFields.keySet();
  }

  /**
   * Get the value of an unrecognizable property of the {@link CasePostResponse}.
   * @param name  The name of the property
   * @return The value of the property
   * @throws NoSuchElementException  If no property with the given name could be found.
   */
  @Nullable
  public Object getCustomField(@Nonnull final String name) throws NoSuchElementException {
    if( !cloudSdkCustomFields.containsKey(name) ) {
        throw new NoSuchElementException("CasePostResponse has no field with name '" + name + "'.");
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
    final CasePostResponse casePostResponse = (CasePostResponse) o;
    return Objects.equals(this.cloudSdkCustomFields, casePostResponse.cloudSdkCustomFields) &&
        Objects.equals(this.value, casePostResponse.value) &&
        Objects.equals(this.info, casePostResponse.info);
  }

  @Override
  public int hashCode() {
    return Objects.hash(value, info, cloudSdkCustomFields);
  }

  @Override
  @Nonnull public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("class CasePostResponse {\n");
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

