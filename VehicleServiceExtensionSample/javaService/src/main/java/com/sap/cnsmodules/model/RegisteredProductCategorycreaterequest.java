

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
import com.sap.cnsmodules.model.RegisteredProductqueryresponseValueInnerDescriptionsInner;
import java.util.ArrayList;
import java.util.List;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * RegisteredProductCategorycreaterequest
 */

// CHECKSTYLE:OFF
public class RegisteredProductCategorycreaterequest 
// CHECKSTYLE:ON
{
  @JsonProperty("code")
  private String code;

  @JsonProperty("descriptions")
  private List<RegisteredProductqueryresponseValueInnerDescriptionsInner> descriptions = new ArrayList<>();

  @JsonAnySetter
  private final Map<String, Object> cloudSdkCustomFields = new LinkedHashMap<>();

   /**
   * Set the code of this {@link RegisteredProductCategorycreaterequest} instance and return the same instance.
   *
   * @param code  The code of this {@link RegisteredProductCategorycreaterequest}
   * @return The same instance of this {@link RegisteredProductCategorycreaterequest} class
   */
   @Nonnull public RegisteredProductCategorycreaterequest code(@Nonnull final String code) {
    this.code = code;
    return this;
  }

   /**
   * Get code
   * @return code  The code of this {@link RegisteredProductCategorycreaterequest} instance.
  **/
  @Nonnull public String getCode() {
    return code;
  }

  /**
  * Set the code of this {@link RegisteredProductCategorycreaterequest} instance.
  *
  * @param code  The code of this {@link RegisteredProductCategorycreaterequest}
  */
  public void setCode( @Nonnull final String code) {
    this.code = code;
  }

   /**
   * Set the descriptions of this {@link RegisteredProductCategorycreaterequest} instance and return the same instance.
   *
   * @param descriptions  The descriptions of this {@link RegisteredProductCategorycreaterequest}
   * @return The same instance of this {@link RegisteredProductCategorycreaterequest} class
   */
   @Nonnull public RegisteredProductCategorycreaterequest descriptions(@Nonnull final List<RegisteredProductqueryresponseValueInnerDescriptionsInner> descriptions) {
    this.descriptions = descriptions;
    return this;
  }
  /**
  * Add one Descriptions instance to this {@link RegisteredProductCategorycreaterequest}.
  * @param descriptionsItem The Descriptions that should be added
  * @return The same instance of type {@link RegisteredProductCategorycreaterequest}
  */
  @Nonnull public RegisteredProductCategorycreaterequest addDescriptionsItem( @Nonnull final RegisteredProductqueryresponseValueInnerDescriptionsInner descriptionsItem) {
    if (this.descriptions == null) {
      this.descriptions = new ArrayList<>();
    }
    this.descriptions.add(descriptionsItem);
    return this;
  }

   /**
   * Get descriptions
   * @return descriptions  The descriptions of this {@link RegisteredProductCategorycreaterequest} instance.
  **/
  @Nonnull public List<RegisteredProductqueryresponseValueInnerDescriptionsInner> getDescriptions() {
    return descriptions;
  }

  /**
  * Set the descriptions of this {@link RegisteredProductCategorycreaterequest} instance.
  *
  * @param descriptions  The descriptions of this {@link RegisteredProductCategorycreaterequest}
  */
  public void setDescriptions( @Nonnull final List<RegisteredProductqueryresponseValueInnerDescriptionsInner> descriptions) {
    this.descriptions = descriptions;
  }

  /**
   * Get the names of the unrecognizable properties of the {@link RegisteredProductCategorycreaterequest}.
   * @return The set of properties names
   */
  @Nonnull
  public Set<String> getCustomFieldNames() {
    return cloudSdkCustomFields.keySet();
  }

  /**
   * Get the value of an unrecognizable property of the {@link RegisteredProductCategorycreaterequest}.
   * @param name  The name of the property
   * @return The value of the property
   * @throws NoSuchElementException  If no property with the given name could be found.
   */
  @Nullable
  public Object getCustomField(@Nonnull final String name) throws NoSuchElementException {
    if( !cloudSdkCustomFields.containsKey(name) ) {
        throw new NoSuchElementException("RegisteredProductCategorycreaterequest has no field with name '" + name + "'.");
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
    final RegisteredProductCategorycreaterequest registeredProductCategorycreaterequest = (RegisteredProductCategorycreaterequest) o;
    return Objects.equals(this.cloudSdkCustomFields, registeredProductCategorycreaterequest.cloudSdkCustomFields) &&
        Objects.equals(this.code, registeredProductCategorycreaterequest.code) &&
        Objects.equals(this.descriptions, registeredProductCategorycreaterequest.descriptions);
  }

  @Override
  public int hashCode() {
    return Objects.hash(code, descriptions, cloudSdkCustomFields);
  }

  @Override
  @Nonnull public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("class RegisteredProductCategorycreaterequest {\n");
    sb.append("    code: ").append(toIndentedString(code)).append("\n");
    sb.append("    descriptions: ").append(toIndentedString(descriptions)).append("\n");
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

