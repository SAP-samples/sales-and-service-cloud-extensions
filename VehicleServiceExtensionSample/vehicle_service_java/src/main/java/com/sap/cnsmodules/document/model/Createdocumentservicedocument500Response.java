

/*
 * Document Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

package com.sap.cnsmodules.document.model;

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
import com.sap.cnsmodules.document.model.Createdocumentservicedocument500ResponseError;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * Createdocumentservicedocument500Response
 */

// CHECKSTYLE:OFF
public class Createdocumentservicedocument500Response 
// CHECKSTYLE:ON
{
  @JsonProperty("error")
  private Createdocumentservicedocument500ResponseError error;

  @JsonAnySetter
  private final Map<String, Object> cloudSdkCustomFields = new LinkedHashMap<>();

   /**
   * Set the error of this {@link Createdocumentservicedocument500Response} instance and return the same instance.
   *
   * @param error  The error of this {@link Createdocumentservicedocument500Response}
   * @return The same instance of this {@link Createdocumentservicedocument500Response} class
   */
   @Nonnull public Createdocumentservicedocument500Response error(@Nonnull final Createdocumentservicedocument500ResponseError error) {
    this.error = error;
    return this;
  }

   /**
   * Get error
   * @return error  The error of this {@link Createdocumentservicedocument500Response} instance.
  **/
  @Nonnull public Createdocumentservicedocument500ResponseError getError() {
    return error;
  }

  /**
  * Set the error of this {@link Createdocumentservicedocument500Response} instance.
  *
  * @param error  The error of this {@link Createdocumentservicedocument500Response}
  */
  public void setError( @Nonnull final Createdocumentservicedocument500ResponseError error) {
    this.error = error;
  }

  /**
   * Get the names of the unrecognizable properties of the {@link Createdocumentservicedocument500Response}.
   * @return The set of properties names
   */
  @Nonnull
  public Set<String> getCustomFieldNames() {
    return cloudSdkCustomFields.keySet();
  }

  /**
   * Get the value of an unrecognizable property of the {@link Createdocumentservicedocument500Response}.
   * @param name  The name of the property
   * @return The value of the property
   * @throws NoSuchElementException  If no property with the given name could be found.
   */
  @Nullable
  public Object getCustomField(@Nonnull final String name) throws NoSuchElementException {
    if( !cloudSdkCustomFields.containsKey(name) ) {
        throw new NoSuchElementException("Createdocumentservicedocument500Response has no field with name '" + name + "'.");
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
    final Createdocumentservicedocument500Response createdocumentservicedocument500Response = (Createdocumentservicedocument500Response) o;
    return Objects.equals(this.cloudSdkCustomFields, createdocumentservicedocument500Response.cloudSdkCustomFields) &&
        Objects.equals(this.error, createdocumentservicedocument500Response.error);
  }

  @Override
  public int hashCode() {
    return Objects.hash(error, cloudSdkCustomFields);
  }

  @Override
  @Nonnull public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("class Createdocumentservicedocument500Response {\n");
    sb.append("    error: ").append(toIndentedString(error)).append("\n");
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

