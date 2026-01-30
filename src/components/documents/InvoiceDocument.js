import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from '../../../public/lockartLogo.png';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  logoSection: {
    flexDirection: "column",
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  companyInfo: {
    textAlign: "right",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 5,
    textAlign: "right",
    color: "#111",
  },
  subtitle: {
    fontSize: 10,
    textAlign: "right",
    color: "#666",
    marginBottom: 10,
  },
  billToSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    marginTop: 20,
  },
  billToLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#111",
  },
  billToText: {
    fontSize: 10,
    marginBottom: 3,
    color: "#444",
  },
  invoiceDetails: {
    textAlign: "right",
  },
  invoiceRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 3,
  },
  invoiceLabel: {
    width: 80,
    fontWeight: "bold",
    color: "#444",
  },
  invoiceValue: {
    width: 80,
    textAlign: "right",
    fontWeight: "bold",
  },
  table: {
    flexDirection: "column",
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#666",
    color: "#FFF",
    padding: 8,
    alignItems: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    padding: 8,
    alignItems: "center",
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1, textAlign: "right" },
  colDisc: { flex: 1, textAlign: "right" },
  colAmount: { flex: 1, textAlign: "right" },

  footerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 10,
  },
  thankYouMsg: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#666",
    marginTop: 10,
    flex: 1,
  },
  totalsSection: {
    width: 250,
    marginLeft: 'auto',
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingVertical: 2,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 10,
    textAlign: "right",
    color: "#333",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111",
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111",
  },
});


const InvoiceDocument = ({ invoiceData }) => {
  const {
    invoiceNo,
    issueDate,
    dueDate,
    client,
    items,
    subtotal,
    tax,
    total,
    deliveryDate
  } = invoiceData;

  console.log(invoiceData, "invoice data");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image
              src={logo}
              style={styles.logo}
              height={50}
              width={50}
            />
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.subtitle}>TAX INVOICE</Text>
            <Text>Locart</Text>
            <Text>New York</Text>
            <Text>505</Text>
            <Text>New York New York 390012</Text>
            <Text>United States</Text>
            <Text>Tax Reg. No.: FLKA3124G</Text>
            <Text>locart@gmail.com</Text>
          </View>
        </View>

        {/* Bill To & Invoice Details */}
        <View style={styles.billToSection}>
          <View>
            <Text style={styles.billToLabel}>BILL TO</Text>
            <Text style={styles.billToText}>{client.name}</Text>
            <Text style={styles.billToText}>{client.address || "Sarabhai Campus, K10 Grand"}</Text>
            <Text style={styles.billToText}>{client.cityState || "390012 Vadodara Gujarat"}</Text>
            <Text style={styles.billToText}>{client.country || "India"}</Text>

            <View style={{ marginTop: 10, flexDirection: 'row' }}>
              <Text style={{ width: 60, fontSize: 9 }}>Business ID:</Text>
              <Text style={{ fontSize: 9 }}>5362789103493857</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ width: 60, fontSize: 9 }}>:</Text>
              <Text style={{ fontSize: 9 }}>9483767289287364</Text>
            </View>

          </View>

          <View style={styles.invoiceDetails}>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Invoice No.:</Text>
              <Text style={styles.invoiceValue}>{invoiceNo}</Text>
            </View>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Issue date:</Text>
              <Text style={styles.invoiceValue}>{issueDate}</Text>
            </View>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Due date:</Text>
              <Text style={styles.invoiceValue}>{dueDate}</Text>
            </View>
            <View style={{ ...styles.invoiceRow, marginTop: 10 }}>
              <Text style={styles.invoiceLabel}>Delivery date:</Text>
              <Text style={styles.invoiceValue}>{deliveryDate || issueDate}</Text>
            </View>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>DESCRIPTION</Text>
            <Text style={styles.colQty}>QUANTITY</Text>
            <Text style={styles.colPrice}>UNIT PRICE ($)</Text>
            <Text style={styles.colDisc}>DISCOUNT %</Text>
            <Text style={styles.colAmount}>AMOUNT ($)</Text>
          </View>

          {/* Table Rows */}
          {items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{Number(item.price).toFixed(2)}</Text>
              <Text style={styles.colDisc}>{Number(item.discount).toFixed(2)}</Text>
              <Text style={styles.colAmount}>{Number(item.amount).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Footer & Totals */}
        <View style={styles.footerSection}>
          <Text style={styles.thankYouMsg}>Thank you for the business</Text>

          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SUBTOTAL:</Text>
              <Text style={styles.totalValue}>${Number(subtotal).toFixed(2)}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TAX 8% from ${Number(subtotal).toFixed(2)}</Text>
              <Text style={styles.totalValue}>${Number(tax).toFixed(2)}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL (USD):</Text>
              <Text style={styles.totalValue}>${Number(total).toFixed(2)}</Text>
            </View>

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>TOTAL DUE (USD)</Text>
              <Text style={styles.grandTotalValue}>${Number(total).toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceDocument;
