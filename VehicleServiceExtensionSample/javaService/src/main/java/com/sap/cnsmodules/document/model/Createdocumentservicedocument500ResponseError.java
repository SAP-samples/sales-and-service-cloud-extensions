

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
import com.sap.cnsmodules.document.model.Createdocumentservicedocument500ResponseErrorDetailsInner;
import java.util.ArrayList;
import java.util.List;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * Createdocumentservicedocument500ResponseError
 */

// CHECKSTYLE:OFF
public class Createdocumentservicedocument500ResponseError 
// CHECKSTYLE:ON
{
  @JsonProperty("code")
  private String code;

  @JsonProperty("details")
  private List<Createdocumentservicedocument500ResponseErrorDetailsInner> details = new ArrayList<>();

  @JsonProperty("message")
  private String message;

  @JsonProperty("target")
  private String target;

  @JsonAnySetter
  private final Map<String, Object> cloudSdkCustomFields = new LinkedHashMap<>();

   /**
   * Set the code of this {@link Createdocumentservicedocument500ResponseError} instance and return the same instance.
   *
   * @param code  The code of this {@link Createdocumentservicedocument500ResponseError}
   * @return The same instance of this {@link Createdocumentservicedocument500ResponseError} class
   */
   @Nonnull public Createdocumentservicedocument500ResponseError code(@Nonnull final String code) {
    this.code = code;
    return this;
  }

   /**
   * Get code
   * @return code  The code of this {@link Createdocumentservicedocument500ResponseError} instance.
  **/
  @Nonnull public String getCode() {
    return code;
  }

  /**
  * Set the code of this {@link Createdocumentservicedocument500ResponseError} instance.
  *
  * @param code  The code of this {@link Createdocumentservicedocument500ResponseError}
  */
  public void setCode( @Nonnull final String code) {
    this.code = code;
  }

   /**
   * Set the details of this {@link Createdocumentservicedocument500ResponseError} instance and return the same instance.
   *
   * @param details  The details of this {@link Createdocumentservicedocument500ResponseError}
   * @return The same instance of this {@link Createdocumentservicedocument500ResponseError} class
   */
   @Nonnull public Createdocumentservicedocument500ResponseError details(@Nonnull final List<Createdocumentservicedocument500ResponseErrorDetailsInner> details) {
    this.details = details;
    return this;
  }
  /**
  * Add one Details instance to this {@link Createdocumentservicedocument500ResponseError}.
  * @param detailsItem The Details that should be added
  * @return The same instance of type {@link Createdocumentservicedocument500ResponseError}
  */
  @Nonnull public Createdocumentservicedocument500ResponseError addDetailsItem( @Nonnull final Createdocumentservicedocument500ResponseErrorDetailsInner detailsItem) {
    if (this.details == null) {
      this.details = new ArrayList<>();
    }
    this.details.add(detailsItem);
    return this;
  }

   /**
   * Get details
   * @return details  The details of this {@link Createdocumentservicedocument500ResponseError} instance.
  **/
  @Nonnull public List<Createdocumentservicedocument500ResponseErrorDetailsInner> getDetails() {
    return details;
  }

  /**
  * Set the details of this {@link Createdocumentservicedocument500ResponseError} instance.
  *
  * @param details  The details of this {@link Createdocumentservicedocument500ResponseError}
  */
  public void setDetails( @Nonnull final List<Createdocumentservicedocument500ResponseErrorDetailsInner> details) {
    this.details = details;
  }

   /**
   * Set the message of this {@link Createdocumentservicedocument500ResponseError} instance and return the same instance.
   *
   * @param message  The message of this {@link Createdocumentservicedocument500ResponseError}
   * @return The same instance of this {@link Createdocumentservicedocument500ResponseError} class
   */
   @Nonnull public Createdocumentservicedocument500ResponseError message(@Nonnull final String message) {
    this.message = message;
    return this;
  }

   /**
   * Get message
   * @return message  The message of this {@link Createdocumentservicedocument500ResponseError} instance.
  **/
  @Nonnull public String getMessage() {
    return message;
  }

  /**
  * Set the message of this {@link Createdocumentservicedocument500ResponseError} instance.
  *
  * @param message  The message of this {@link Createdocumentservicedocument500ResponseError}
  */
  public void setMessage( @Nonnull final String message) {
    this.message = message;
  }

   /**
   * Set the target of this {@link Createdocumentservicedocument500ResponseError} instance and return the same instance.
   *
   * @param target  The target of this {@link Createdocumentservicedocument500ResponseError}
   * @return The same instance of this {@link Createdocumentservicedocument500ResponseError} class
   */
   @Nonnull public Createdocumentservicedocument500ResponseError target(@Nonnull final String target) {
    this.target = target;
    return this;
  }

   /**
   * Get target
   * @return target  The target of this {@link Createdocumentservicedocument500ResponseError} instance.
  **/
  @Nonnull public String getTarget() {
    return target;
  }

  /**
  * Set the target of this {@link Createdocumentservicedocument500ResponseError} instance.
  *
  * @param target  The target of this {@link Createdocumentservicedocument500ResponseError}
  */
  public void setTarget( @Nonnull final String target) {
    this.target = target;
  }

  /**
   * Get the names of the unrecognizable properties of the {@link Createdocumentservicedocument500ResponseError}.
   * @return The set of properties names
   */
  @Nonnull
  public Set<String> getCustomFieldNames() {
    return cloudSdkCustomFields.keySet();
  }

  /**
   * Get the value of an unrecognizable property of the {@link Createdocumentservicedocument500ResponseError}.
   * @param name  The name of the property
   * @return The value of the property
   * @throws NoSuchElementException  If no property with the given name could be found.
   */
  @Nullable
  public Object getCustomField(@Nonnull final String name) throws NoSuchElementException {
    if( !cloudSdkCustomFields.containsKey(name) ) {
        throw new NoSuchElementException("Createdocumentservicedocument500ResponseError has no field with name '" + name + "'.");
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
    final Createdocumentservicedocument500ResponseError createdocumentservicedocument500ResponseError = (Createdocumentservicedocument500ResponseError) o;
    return Objects.equals(this.cloudSdkCustomFields, createdocumentservicedocument500ResponseError.cloudSdkCustomFields) &&
        Objects.equals(this.code, createdocumentservicedocument500ResponseError.code) &&
        Objects.equals(this.details, createdocumentservicedocument500ResponseError.details) &&
        Objects.equals(this.message, createdocumentservicedocument500ResponseError.message) &&
        Objects.equals(this.target, createdocumentservicedocument500ResponseError.target);
  }

  @Override
  public int hashCode() {
    return Objects.hash(code, details, message, target, cloudSdkCustomFields);
  }

  @Override
  @Nonnull public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("class Createdocumentservicedocument500ResponseError {\n");
    sb.append("    code: ").append(toIndentedString(code)).append("\n");
    sb.append("    details: ").append(toIndentedString(details)).append("\n");
    sb.append("    message: ").append(toIndentedString(message)).append("\n");
    sb.append("    target: ").append(toIndentedString(target)).append("\n");
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

