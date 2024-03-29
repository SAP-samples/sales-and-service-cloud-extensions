

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
import com.sap.cnsmodules.model.RegisteredProductqueryresponseValueInner;
import java.util.ArrayList;
import java.util.List;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * RegisteredProductqueryresponse
 */

// CHECKSTYLE:OFF
public class RegisteredProductqueryresponse 
// CHECKSTYLE:ON
{
  @JsonProperty("count")
  private Integer count;

  @JsonProperty("value")
  private List<RegisteredProductqueryresponseValueInner> value = new ArrayList<>();

  @JsonAnySetter
  private final Map<String, Object> cloudSdkCustomFields = new LinkedHashMap<>();

   /**
   * Set the count of this {@link RegisteredProductqueryresponse} instance and return the same instance.
   *
   * @param count  The count of this {@link RegisteredProductqueryresponse}
   * @return The same instance of this {@link RegisteredProductqueryresponse} class
   */
   @Nonnull public RegisteredProductqueryresponse count(@Nonnull final Integer count) {
    this.count = count;
    return this;
  }

   /**
   * Get count
   * @return count  The count of this {@link RegisteredProductqueryresponse} instance.
  **/
  @Nonnull public Integer getCount() {
    return count;
  }

  /**
  * Set the count of this {@link RegisteredProductqueryresponse} instance.
  *
  * @param count  The count of this {@link RegisteredProductqueryresponse}
  */
  public void setCount( @Nonnull final Integer count) {
    this.count = count;
  }

   /**
   * Set the value of this {@link RegisteredProductqueryresponse} instance and return the same instance.
   *
   * @param value  The value of this {@link RegisteredProductqueryresponse}
   * @return The same instance of this {@link RegisteredProductqueryresponse} class
   */
   @Nonnull public RegisteredProductqueryresponse value(@Nonnull final List<RegisteredProductqueryresponseValueInner> value) {
    this.value = value;
    return this;
  }
  /**
  * Add one Value instance to this {@link RegisteredProductqueryresponse}.
  * @param valueItem The Value that should be added
  * @return The same instance of type {@link RegisteredProductqueryresponse}
  */
  @Nonnull public RegisteredProductqueryresponse addValueItem( @Nonnull final RegisteredProductqueryresponseValueInner valueItem) {
    if (this.value == null) {
      this.value = new ArrayList<>();
    }
    this.value.add(valueItem);
    return this;
  }

   /**
   * Get value
   * @return value  The value of this {@link RegisteredProductqueryresponse} instance.
  **/
  @Nonnull public List<RegisteredProductqueryresponseValueInner> getValue() {
    return value;
  }

  /**
  * Set the value of this {@link RegisteredProductqueryresponse} instance.
  *
  * @param value  The value of this {@link RegisteredProductqueryresponse}
  */
  public void setValue( @Nonnull final List<RegisteredProductqueryresponseValueInner> value) {
    this.value = value;
  }

  /**
   * Get the names of the unrecognizable properties of the {@link RegisteredProductqueryresponse}.
   * @return The set of properties names
   */
  @Nonnull
  public Set<String> getCustomFieldNames() {
    return cloudSdkCustomFields.keySet();
  }

  /**
   * Get the value of an unrecognizable property of the {@link RegisteredProductqueryresponse}.
   * @param name  The name of the property
   * @return The value of the property
   * @throws NoSuchElementException  If no property with the given name could be found.
   */
  @Nullable
  public Object getCustomField(@Nonnull final String name) throws NoSuchElementException {
    if( !cloudSdkCustomFields.containsKey(name) ) {
        throw new NoSuchElementException("RegisteredProductqueryresponse has no field with name '" + name + "'.");
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
    final RegisteredProductqueryresponse registeredProductqueryresponse = (RegisteredProductqueryresponse) o;
    return Objects.equals(this.cloudSdkCustomFields, registeredProductqueryresponse.cloudSdkCustomFields) &&
        Objects.equals(this.count, registeredProductqueryresponse.count) &&
        Objects.equals(this.value, registeredProductqueryresponse.value);
  }

  @Override
  public int hashCode() {
    return Objects.hash(count, value, cloudSdkCustomFields);
  }

  @Override
  @Nonnull public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("class RegisteredProductqueryresponse {\n");
    sb.append("    count: ").append(toIndentedString(count)).append("\n");
    sb.append("    value: ").append(toIndentedString(value)).append("\n");
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

