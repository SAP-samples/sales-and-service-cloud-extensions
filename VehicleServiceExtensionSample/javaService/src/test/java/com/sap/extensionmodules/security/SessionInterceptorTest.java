package com.sap.extensionmodules.security;
import com.sap.cloud.sdk.cloudplatform.connectivity.DefaultHttpDestination;
import com.sap.cloud.security.token.Token;
import com.sap.cloud.security.token.TokenClaims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(MockitoJUnitRunner.class)
class SessionInterceptorTest {

    @Mock
    MockHttpServletResponse response;

    @Mock
    RequestContextProvider requestContextProvider;

    @Mock HttpServletRequest request;

    @InjectMocks
    private SessionInterceptor interceptor;



    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void preHandle_ValidToken_ShouldSetSessionAttributes() throws Exception {
        // Arrange
        final String dummyToken =
                "****";

        Token token2 = Mockito.mock(Token.class);
        DefaultHttpDestination destination = Mockito.mock(DefaultHttpDestination.class);
        RequestContext requestContext = RequestContext.builder()
                .authToken(dummyToken)
                .destination(destination).build();
        Mockito.when(requestContextProvider.getRequestContext())
                .thenReturn(requestContext);
        Mockito.when(request.getHeader("Authorization")).thenReturn(dummyToken);
        Mockito.when(request.getHeader("accept-language")).thenReturn("en-us");

        Mockito.when(token2.getTokenValue()).thenReturn("testTokenValue");
        Mockito.when(token2.getClaimAsString(TokenClaims.USER_NAME)).thenReturn("testUserId");
        boolean result = interceptor.preHandle(request, response, null);

        // Assert
        assertTrue(result);


    }

    @Test
    void preHandle_InvalidToken_ShouldNotSetSessionAttributes(){
        String dummyToken = "abcd";
        DefaultHttpDestination destination = Mockito.mock(DefaultHttpDestination.class);
        RequestContext requestContext = RequestContext.builder()
                .authToken(dummyToken)
                .destination(destination).build();
        Mockito.when(requestContextProvider.getRequestContext())
                .thenReturn(requestContext);
        Mockito.when(request.getHeader("Authorization")).thenReturn(null);
        Mockito.when(request.getHeader("accept-language")).thenReturn("en-us");

        assertThrows(ResponseStatusException.class, () -> interceptor.preHandle(request, response, null));

    }
}

