

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
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * ErrorErrorDetailsInner
 */

// CHECKSTYLE:OFF
public class ErrorErrorDetailsInner 
// CHECKSTYLE:ON
{
  @JsonProperty("message")
  private String message;

  @JsonProperty("code")
  private String code;

  @JsonProperty("target")
  private String target;

  @JsonAnySetter
  private final Map<String, Object> cloudSdkCustomFields = new LinkedHashMap<>();

   /**
   * Set the message of this {@link ErrorErrorDetailsInner} instance and return the same instance.
   *
   * @param message  The message of this {@link ErrorErrorDetailsInner}
   * @return The same instance of this {@link ErrorErrorDetailsInner} class
   */
   @Nonnull public ErrorErrorDetailsInner message(@Nonnull final String message) {
    this.message = message;
    return this;
  }

   /**
   * Get message
   * @return message  The message of this {@link ErrorErrorDetailsInner} instance.
  **/
  @Nonnull public String getMessage() {
    return message;
  }

  /**
  * Set the message of this {@link ErrorErrorDetailsInner} instance.
  *
  * @param message  The message of this {@link ErrorErrorDetailsInner}
  */
  public void setMessage( @Nonnull final String message) {
    this.message = message;
  }

   /**
   * Set the code of this {@link ErrorErrorDetailsInner} instance and return the same instance.
   *
   * @param code  The code of this {@link ErrorErrorDetailsInner}
   * @return The same instance of this {@link ErrorErrorDetailsInner} class
   */
   @Nonnull public ErrorErrorDetailsInner code(@Nonnull final String code) {
    this.code = code;
    return this;
  }

   /**
   * Get code
   * @return code  The code of this {@link ErrorErrorDetailsInner} instance.
  **/
  @Nonnull public String getCode() {
    return code;
  }

  /**
  * Set the code of this {@link ErrorErrorDetailsInner} instance.
  *
  * @param code  The code of this {@link ErrorErrorDetailsInner}
  */
  public void setCode( @Nonnull final String code) {
    this.code = code;
  }

   /**
   * Set the target of this {@link ErrorErrorDetailsInner} instance and return the same instance.
   *
   * @param target  The target of this {@link ErrorErrorDetailsInner}
   * @return The same instance of this {@link ErrorErrorDetailsInner} class
   */
   @Nonnull public ErrorErrorDetailsInner target(@Nonnull final String target) {
    this.target = target;
    return this;
  }

   /**
   * Get target
   * @return target  The target of this {@link ErrorErrorDetailsInner} instance.
  **/
  @Nonnull public String getTarget() {
    return target;
  }

  /**
  * Set the target of this {@link ErrorErrorDetailsInner} instance.
  *
  * @param target  The target of this {@link ErrorErrorDetailsInner}
  */
  public void setTarget( @Nonnull final String target) {
    this.target = target;
  }

  /**
   * Get the names of the unrecognizable properties of the {@link ErrorErrorDetailsInner}.
   * @return The set of properties names
   */
  @Nonnull
  public Set<String> getCustomFieldNames() {
    return cloudSdkCustomFields.keySet();
  }

  /**
   * Get the value of an unrecognizable property of the {@link ErrorErrorDetailsInner}.
   * @param name  The name of the property
   * @return The value of the property
   * @throws NoSuchElementException  If no property with the given name could be found.
   */
  @Nullable
  public Object getCustomField(@Nonnull final String name) throws NoSuchElementException {
    if( !cloudSdkCustomFields.containsKey(name) ) {
        throw new NoSuchElementException("ErrorErrorDetailsInner has no field with name '" + name + "'.");
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
    final ErrorErrorDetailsInner errorErrorDetailsInner = (ErrorErrorDetailsInner) o;
    return Objects.equals(this.cloudSdkCustomFields, errorErrorDetailsInner.cloudSdkCustomFields) &&
        Objects.equals(this.message, errorErrorDetailsInner.message) &&
        Objects.equals(this.code, errorErrorDetailsInner.code) &&
        Objects.equals(this.target, errorErrorDetailsInner.target);
  }

  @Override
  public int hashCode() {
    return Objects.hash(message, code, target, cloudSdkCustomFields);
  }

  @Override
  @Nonnull public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("class ErrorErrorDetailsInner {\n");
    sb.append("    message: ").append(toIndentedString(message)).append("\n");
    sb.append("    code: ").append(toIndentedString(code)).append("\n");
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

