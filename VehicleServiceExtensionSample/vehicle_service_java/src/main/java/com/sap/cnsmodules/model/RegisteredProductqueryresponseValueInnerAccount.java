

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
import java.util.UUID;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * RegisteredProductqueryresponseValueInnerAccount
 */

// CHECKSTYLE:OFF
public class RegisteredProductqueryresponseValueInnerAccount 
// CHECKSTYLE:ON
{
  @JsonProperty("mainContactName")
  private String mainContactName;

  @JsonProperty("mainContactDisplayId")
  private String mainContactDisplayId;

  @JsonProperty("mainContactId")
  private UUID mainContactId;

  @JsonProperty("displayId")
  private String displayId;

  @JsonProperty("name")
  private String name;

  @JsonProperty("id")
  private UUID id;

  @JsonAnySetter
  private final Map<String, Object> cloudSdkCustomFields = new LinkedHashMap<>();

   /**
   * Set the mainContactName of this {@link RegisteredProductqueryresponseValueInnerAccount} instance and return the same instance.
   *
   * @param mainContactName  The mainContactName of this {@link RegisteredProductqueryresponseValueInnerAccount}
   * @return The same instance of this {@link RegisteredProductqueryresponseValueInnerAccount} class
   */
   @Nonnull public RegisteredProductqueryresponseValueInnerAccount mainContactName(@Nonnull final String mainContactName) {
    this.mainContactName = mainContactName;
    return this;
  }

   /**
   * Get mainContactName
   * @return mainContactName  The mainContactName of this {@link RegisteredProductqueryresponseValueInnerAccount} instance.
  **/
  @Nonnull public String getMainContactName() {
    return mainContactName;
  }

  /**
  * Set the mainContactName of this {@link RegisteredProductqueryresponseValueInnerAccount} instance.
  *
  * @param mainContactName  The mainContactName of this {@link RegisteredProductqueryresponseValueInnerAccount}
  */
  public void setMainContactName( @Nonnull final String mainContactName) {
    this.mainContactName = mainContactName;
  }

   /**
   * Set the mainContactDisplayId of this {@link RegisteredProductqueryresponseValueInnerAccount} instance and return the same instance.
   *
   * @param mainContactDisplayId  The mainContactDisplayId of this {@link RegisteredProductqueryresponseValueInnerAccount}
   * @return The same instance of this {@link RegisteredProductqueryresponseValueInnerAccount} class
   */
   @Nonnull public RegisteredProductqueryresponseValueInnerAccount mainContactDisplayId(@Nonnull final String mainContactDisplayId) {
    this.mainContactDisplayId = mainContactDisplayId;
    return this;
  }

   /**
   * Get mainContactDisplayId
   * @return mainContactDisplayId  The mainContactDisplayId of this {@link RegisteredProductqueryresponseValueInnerAccount} instance.
  **/
  @Nonnull public String getMainContactDisplayId() {
    return mainContactDisplayId;
  }

  /**
  * Set the mainContactDisplayId of this {@link RegisteredProductqueryresponseValueInnerAccount} instance.
  *
  * @param mainContactDisplayId  The mainContactDisplayId of this {@link RegisteredProductqueryresponseValueInnerAccount}
  */
  public void setMainContactDisplayId( @Nonnull final String mainContactDisplayId) {
    this.mainContactDisplayId = mainContactDisplayId;
  }

   /**
   * Set the mainContactId of this {@link RegisteredProductqueryresponseValueInnerAccount} instance and return the same instance.
   *
   * @param mainContactId  The mainContactId of this {@link RegisteredProductqueryresponseValueInnerAccount}
   * @return The same instance of this {@link RegisteredProductqueryresponseValueInnerAccount} class
   */
   @Nonnull public RegisteredProductqueryresponseValueInnerAccount mainContactId(@Nonnull final UUID mainContactId) {
    this.mainContactId = mainContactId;
    return this;
  }

   /**
   * Get mainContactId
   * @return mainContactId  The mainContactId of this {@link RegisteredProductqueryresponseValueInnerAccount} instance.
  **/
  @Nonnull public UUID getMainContactId() {
    return mainContactId;
  }

  /**
  * Set the mainContactId of this {@link RegisteredProductqueryresponseValueInnerAccount} instance.
  *
  * @param mainContactId  The mainContactId of this {@link RegisteredProductqueryresponseValueInnerAccount}
  */
  public void setMainContactId( @Nonnull final UUID mainContactId) {
    this.mainContactId = mainContactId;
  }

   /**
   * Set the displayId of this {@link RegisteredProductqueryresponseValueInnerAccount} instance and return the same instance.
   *
   * @param displayId  The displayId of this {@link RegisteredProductqueryresponseValueInnerAccount}
   * @return The same instance of this {@link RegisteredProductqueryresponseValueInnerAccount} class
   */
   @Nonnull public RegisteredProductqueryresponseValueInnerAccount displayId(@Nonnull final String displayId) {
    this.displayId = displayId;
    return this;
  }

   /**
   * Get displayId
   * @return displayId  The displayId of this {@link RegisteredProductqueryresponseValueInnerAccount} instance.
  **/
  @Nonnull public String getDisplayId() {
    return displayId;
  }

  /**
  * Set the displayId of this {@link RegisteredProductqueryresponseValueInnerAccount} instance.
  *
  * @param displayId  The displayId of this {@link RegisteredProductqueryresponseValueInnerAccount}
  */
  public void setDisplayId( @Nonnull final String displayId) {
    this.displayId = displayId;
  }

   /**
   * Set the name of this {@link RegisteredProductqueryresponseValueInnerAccount} instance and return the same instance.
   *
   * @param name  The name of this {@link RegisteredProductqueryresponseValueInnerAccount}
   * @return The same instance of this {@link RegisteredProductqueryresponseValueInnerAccount} class
   */
   @Nonnull public RegisteredProductqueryresponseValueInnerAccount name(@Nonnull final String name) {
    this.name = name;
    return this;
  }

   /**
   * Get name
   * @return name  The name of this {@link RegisteredProductqueryresponseValueInnerAccount} instance.
  **/
  @Nonnull public String getName() {
    return name;
  }

  /**
  * Set the name of this {@link RegisteredProductqueryresponseValueInnerAccount} instance.
  *
  * @param name  The name of this {@link RegisteredProductqueryresponseValueInnerAccount}
  */
  public void setName( @Nonnull final String name) {
    this.name = name;
  }

   /**
   * Set the id of this {@link RegisteredProductqueryresponseValueInnerAccount} instance and return the same instance.
   *
   * @param id  The id of this {@link RegisteredProductqueryresponseValueInnerAccount}
   * @return The same instance of this {@link RegisteredProductqueryresponseValueInnerAccount} class
   */
   @Nonnull public RegisteredProductqueryresponseValueInnerAccount id(@Nonnull final UUID id) {
    this.id = id;
    return this;
  }

   /**
   * Get id
   * @return id  The id of this {@link RegisteredProductqueryresponseValueInnerAccount} instance.
  **/
  @Nonnull public UUID getId() {
    return id;
  }

  /**
  * Set the id of this {@link RegisteredProductqueryresponseValueInnerAccount} instance.
  *
  * @param id  The id of this {@link RegisteredProductqueryresponseValueInnerAccount}
  */
  public void setId( @Nonnull final UUID id) {
    this.id = id;
  }

  /**
   * Get the names of the unrecognizable properties of the {@link RegisteredProductqueryresponseValueInnerAccount}.
   * @return The set of properties names
   */
  @Nonnull
  public Set<String> getCustomFieldNames() {
    return cloudSdkCustomFields.keySet();
  }

  /**
   * Get the value of an unrecognizable property of the {@link RegisteredProductqueryresponseValueInnerAccount}.
   * @param name  The name of the property
   * @return The value of the property
   * @throws NoSuchElementException  If no property with the given name could be found.
   */
  @Nullable
  public Object getCustomField(@Nonnull final String name) throws NoSuchElementException {
    if( !cloudSdkCustomFields.containsKey(name) ) {
        throw new NoSuchElementException("RegisteredProductqueryresponseValueInnerAccount has no field with name '" + name + "'.");
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
    final RegisteredProductqueryresponseValueInnerAccount registeredProductqueryresponseValueInnerAccount = (RegisteredProductqueryresponseValueInnerAccount) o;
    return Objects.equals(this.cloudSdkCustomFields, registeredProductqueryresponseValueInnerAccount.cloudSdkCustomFields) &&
        Objects.equals(this.mainContactName, registeredProductqueryresponseValueInnerAccount.mainContactName) &&
        Objects.equals(this.mainContactDisplayId, registeredProductqueryresponseValueInnerAccount.mainContactDisplayId) &&
        Objects.equals(this.mainContactId, registeredProductqueryresponseValueInnerAccount.mainContactId) &&
        Objects.equals(this.displayId, registeredProductqueryresponseValueInnerAccount.displayId) &&
        Objects.equals(this.name, registeredProductqueryresponseValueInnerAccount.name) &&
        Objects.equals(this.id, registeredProductqueryresponseValueInnerAccount.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(mainContactName, mainContactDisplayId, mainContactId, displayId, name, id, cloudSdkCustomFields);
  }

  @Override
  @Nonnull public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("class RegisteredProductqueryresponseValueInnerAccount {\n");
    sb.append("    mainContactName: ").append(toIndentedString(mainContactName)).append("\n");
    sb.append("    mainContactDisplayId: ").append(toIndentedString(mainContactDisplayId)).append("\n");
    sb.append("    mainContactId: ").append(toIndentedString(mainContactId)).append("\n");
    sb.append("    displayId: ").append(toIndentedString(displayId)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
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
