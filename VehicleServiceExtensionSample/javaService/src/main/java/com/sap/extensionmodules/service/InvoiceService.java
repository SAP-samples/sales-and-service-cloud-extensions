package com.sap.extensionmodules.service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;
import com.sap.cnsmodules.document.api.DocumentApi;
import com.sap.cnsmodules.document.model.DocumentCreateRequest;
import com.sap.cnsmodules.document.model.DocumentPostResponse;
import com.sap.cnsmodules.model.CasePatchResponse;
import com.sap.cnsmodules.model.CasePatchUpdateRequest;
import com.sap.cnsmodules.model.CaseReadResponse;
import com.sap.extensionmodules.dtos.JobCardDto;
import com.sap.extensionmodules.dtos.JobCardServicesDto;
import com.sap.extensionmodules.security.RequestContextProvider;
import com.sap.extensionmodules.mappers.VehicleServiceMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.*;

@Slf4j
@Service
public class InvoiceService {
    @Autowired CaseService caseService;
    @Autowired VehicleServiceMapper mapper;
    private DocumentApi documentApi;
    @Autowired
    RequestContextProvider requestContextProvider;
    private CloseableHttpClient client;

    private HttpDestination destination;
    private Gson gson= new Gson();

    public void InvoiceService(){
        client = HttpClients.createDefault();
    }

    public void createInvoice(JobCardDto dto){
        ByteArrayInputStream bArr = generateInvoice(dto);

        DocumentCreateRequest docReq = new DocumentCreateRequest();
        docReq.setCategory("DOCUMENT");
        docReq.setType("10001");
        docReq.setIsSelected(false);
        docReq.setFileName("vehicle_invoice_"+ dto.getCaseDisplayId()+".pdf");
        DocumentPostResponse docRes = createDocument(docReq);
        int uploadStatus = uploadDocument(bArr, docRes.getValue().getUploadUrl());
        if(uploadStatus==200){
            CasePatchResponse res = updateCaseWithInvoice(dto.getCaseId(), docRes) ;
            log.info(res.toString());
        }
    }
    public ByteArrayInputStream generateInvoice(JobCardDto jobCard){
        Document document = new Document();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            PdfWriter.getInstance(document, outputStream);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.TIMES_BOLD, 18);
            Font boldFont = FontFactory.getFont(FontFactory.TIMES_BOLD, 13);
            Font regularFont = FontFactory.getFont(FontFactory.TIMES_ROMAN, 13);
            Font boldTitleFont = FontFactory.getFont(FontFactory.TIMES_BOLD, 16);

            Paragraph title = new Paragraph("Vehicle Service - Invoice", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);

            document.add(title);

            document.add(new Paragraph("\n"));

            document.add(new Paragraph("ID - " + jobCard.getDisplayId() + "        External ID - " + jobCard.getCaseId()
                    + "       Date of Purchase - " + jobCard.getRegisteredProduct().getDateOfPurchase(), regularFont));
            document.add(new Paragraph("\n"));
            document.add(new Paragraph("Created On - " + jobCard.getAdminData().getCreatedOn()
                    + "       Estimated Completion Date - " + jobCard.getEstimatedCompletionDate(), regularFont));
            document.add(new Paragraph("\n"));

            document.add(new Paragraph("Vehicle:", boldFont));
            document.add(new Paragraph("Model - " + jobCard.getRegisteredProduct().getModel()
                    + "      VIN - " + jobCard.getRegisteredProduct().getVehicleNumber()
                    + "       Milometer - " + jobCard.getMilometer(), regularFont));
            document.add(new Paragraph("\n"));

            document.add(new Paragraph("Customer:", boldFont));
            document.add(new Paragraph("Customer - " + jobCard.getCustomerDetails().getName()
                    + "       Contact - " + jobCard.getCustomerDetails().getContactNumber(), regularFont));
            document.add(new Paragraph("\n"));

            document.add(new Paragraph("Service Advisor - " + jobCard.getServiceAdvisor(), regularFont));
            document.add(new Paragraph("\n"));

            Paragraph serviceSelected = new Paragraph("Service Selected:", boldTitleFont);
            serviceSelected.setSpacingAfter(5);
            document.add(serviceSelected);
            document.add(new Paragraph("\n"));

            List<JobCardServicesDto> services = jobCard.getServicesSelected();
            float[] columnWidths = { 1, 3, 3, 2, 2, 2, 3, 3, 2 };
            PdfPTable table = new PdfPTable(columnWidths);
            table.setWidthPercentage(100);

            PdfPCell[] headerCells = new PdfPCell[9];
            headerCells[0] = new PdfPCell(new Paragraph("S.No", boldFont));
            headerCells[1] = new PdfPCell(new Paragraph("Service Description", boldFont));
            headerCells[2] = new PdfPCell(new Paragraph("Assigned Technician", boldFont));
            headerCells[3] = new PdfPCell(new Paragraph("Status", boldFont));
            headerCells[4] = new PdfPCell(new Paragraph("Start Date/Time", boldFont));
            headerCells[5] = new PdfPCell(new Paragraph("End Date/Time", boldFont));
            headerCells[6] = new PdfPCell(new Paragraph("Notes", boldFont));
            headerCells[7] = new PdfPCell(new Paragraph("Observation", boldFont));
            headerCells[8] = new PdfPCell(new Paragraph("Price", boldFont));

            for (PdfPCell cell : headerCells) {
                cell.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);
                table.addCell(cell);
            }

            for (int i = 0; i < services.size(); i++) {
                JobCardServicesDto service = services.get(i);

                table.addCell(new PdfPCell(new Paragraph(String.valueOf(i + 1), regularFont)));
                table.addCell(new PdfPCell(new Paragraph(service.getService() != null ? service.getService() : "-", regularFont)));
                table.addCell(new PdfPCell(new Paragraph(gson.toJson(service.getTechnician()) != null ? gson.toJson(service.getTechnician()) : "-", regularFont)));
                table.addCell(new PdfPCell(new Paragraph(service.getStatus() != null ? service.getStatus() : "-", regularFont)));
                table.addCell(new PdfPCell(new Paragraph(service.getStartTime(), regularFont)));
                table.addCell(new PdfPCell(new Paragraph(service.getEndTime(), regularFont)));
                table.addCell(new PdfPCell(new Paragraph(service.getNotes() != null ?  service.getNotes().toString() : "-", regularFont)));
                table.addCell(new PdfPCell(new Paragraph(service.getObservation() != null ? service.getObservation() : "-", regularFont)));
                table.addCell(new PdfPCell(new Paragraph(service.getPrice() != null ? service.getPrice() : "-", regularFont)));
            }

            document.add(table);

            List<String> complaints = jobCard.getCustomerComplaints();
            if (complaints != null && !complaints.isEmpty()) {
                Paragraph complaintsHeader = new Paragraph("Customer complaints:", boldTitleFont);
                complaintsHeader.setSpacingAfter(5);
                document.add(complaintsHeader);

                for (String complaint : complaints) {
                    document.add(new Paragraph(complaint, regularFont));
                }
            }

            document.add(new Paragraph("\n"));

            float totalPrice = 0;
            for (JobCardServicesDto service : services) {
                if (service.getPrice() != null) {
                    totalPrice += Float.parseFloat(service.getPrice());
                }
            }

            Paragraph total = new Paragraph("Total (Rs) = " + Math.round(totalPrice));
            total.setAlignment(Paragraph.ALIGN_RIGHT);
            document.add(total);

            document.close();
            return new ByteArrayInputStream(outputStream.toByteArray());
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }
    }

    public CasePatchResponse updateCaseWithInvoice(String caseId, DocumentPostResponse docRes){
        String jsonString = "{\"attachments\":[{\"id\":\""+docRes.getValue().getId()+"\"}]}";
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            CaseReadResponse caseById = caseService.getCaseById(UUID.fromString(caseId));
            CasePatchUpdateRequest patchReq = objectMapper.readValue(jsonString, CasePatchUpdateRequest.class);
            mapper.CaseResponseValueToCasePatchUpdate(caseById.getValue(), patchReq);
            return caseService.updateCase(OffsetDateTime.parse(caseById.getValue().getAdminData().getUpdatedOn()),UUID.fromString(caseId), patchReq);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public DocumentPostResponse createDocument(DocumentCreateRequest docReq){
        final DocumentApi service = fetchDocumentApi();
        String authToken = requestContextProvider.getRequestContext().getAuthToken();
        DocumentPostResponse res = service.createdocumentservicedocument(authToken, docReq);
        return res;
    }

    public int uploadDocument(ByteArrayInputStream baos, String url) {
        try {
            HttpPut httpPut = new HttpPut(url);
            HttpEntity fileEntity = new ByteArrayEntity(baos.readAllBytes());
            httpPut.setEntity(fileEntity);
            client = HttpClients.createDefault();
            CloseableHttpResponse response = client.execute(httpPut);
            return response.getStatusLine().getStatusCode();
            }
        catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public DocumentApi fetchDocumentApi(){
        destination = requestContextProvider.getRequestContext().getDestination();
        documentApi = new DocumentApi(destination);
        return documentApi;
    }
}
