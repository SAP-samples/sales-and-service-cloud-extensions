package com.sap.extensionmodules.security;

import com.sap.cloud.sdk.cloudplatform.connectivity.DefaultHttpDestination;
import com.sap.extensionmodules.commons.Constants;
import com.sap.extensionmodules.exception.SecurityContextNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;

import static org.hamcrest.CoreMatchers.instanceOf;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.*;

@Slf4j
class RequestContextProviderTest {

    @InjectMocks
    @Spy
    RequestContextProvider requestContextProvider;

    private RequestContext requestContext;
    private Authentication authentication;
    private SecurityContext securityContext;
    @Mock
    private DefaultHttpDestination destination;

    @Mock
    Constants.CaseStatus caseStatus;

    @Mock
    private Constants.ExtensionFields extensionFields;

    @BeforeEach
    public void setupMock() {
        MockitoAnnotations.openMocks(this);
        authentication = mock(Authentication.class);
        securityContext = mock(SecurityContext.class);

        requestContext =
                requestContext
                        .builder()
                        .userId("36addd73-5f39-11ea-9efa-9b0ce15ed32c")
                        .authToken("authToken")
                        .language("en-us")
                        .destination(destination)
                        .caseStatus(caseStatus)
                        .extensionFields(extensionFields)
                        .roles(Arrays.asList("ViewJobCard", "MasterData", "EditTask"))
                        .build();
    }

    @AfterEach
    public void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Validate Request Context Provider")
    void validateRequestContext() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getDetails()).thenReturn(requestContext);

        Assertions.assertEquals(
                requestContextProvider.getRequestContext().getUserId(), requestContext.getUserId());
        Assertions.assertEquals(
                requestContextProvider.getRequestContext().getLanguage(), requestContext.getLanguage());
        Assertions.assertEquals(
                requestContextProvider.getRequestContext().getAuthToken(), requestContext.getAuthToken());
        Assertions.assertEquals(
                requestContextProvider.getRequestContext().getDestination(), requestContext.getDestination());
        Assertions.assertEquals(
                requestContextProvider.getRequestContext().getCaseStatus(), requestContext.getCaseStatus());
        Assertions.assertEquals(
                requestContextProvider.getRequestContext().getExtensionFields(), requestContext.getExtensionFields());
    }


    @Test
    @DisplayName("Set Request Context Provider")
    void setRequestContext() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getDetails()).thenReturn(requestContext);

        requestContextProvider.setRequestContext(requestContext);
        Assertions.assertEquals(
                SecurityContextHolder.getContext().getAuthentication().getDetails(), requestContext);
    }

    @Test
    @DisplayName("Validate Get Request Context Provider")
    void validateGetRequestContextProvider_nullContext_returnsException() {
        SecurityContextHolder.createEmptyContext();
        when(securityContext.getAuthentication()).thenReturn(null);
        try {
            requestContextProvider.getRequestContext();
        } catch (Exception e) {
            assertThat(e, instanceOf(SecurityContextNotFoundException.class));
        }
    }

    @Test
    @DisplayName("Validate Set Request Context Provider - Null Security Context")
    void validateSetRequestContextProvider_nullContext_returnsException() {
        SecurityContextHolder.createEmptyContext();
        doReturn(null).when(requestContextProvider).getSecurityContext();
        try {
            requestContextProvider.setRequestContext(requestContext);
        } catch (Exception e) {
            assertThat(e, instanceOf(SecurityContextNotFoundException.class));
        }
    }
}
