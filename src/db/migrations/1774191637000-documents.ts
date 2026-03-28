import { type Kysely, sql } from 'kysely';

const privacyPolicyContent = `Zesty Finance ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and share information when you use our website and services (the "Services"). By using Zesty Finance, you agree to the practices outlined in this policy.

## 1. Information We Collect

We collect different types of information from and about users, including:

- **Personal Information:** When you sign up for our Services, we collect personal information such as your name and email address. Personal Information refers to data that identifies or can reasonably be used to identify you.

- **Financial Tracking Data:** You may enter financial data such as transaction records, account balances, budget entries, and other personal finance information. This information is used solely for your personal tracking and analysis purposes.

- **Automatically Collected Information:** We may automatically collect information when you interact with the Services. This may include usage data such as your IP address, browser type, device information, pages visited, time spent on pages, and related analytics.

- **Cookies and Tracking Technologies:** We use cookies and similar tracking technologies to maintain your session, remember your preferences, and understand how the Services are used.

## 2. How We Use Your Information

We use the information we collect in the following ways:

- **To Provide Services:** We use your information to allow you to track and analyze your personal finances and manage your account.

- **To Improve Services:** We may use usage data in an anonymized and aggregated form to analyze trends, improve our services, and develop new features.

- **To Communicate With You:** We may use your email address to send you service-related communications such as account verification, security alerts, and responses to your inquiries.

- **To Ensure Security:** We may use personal data to detect and prevent fraud, abuse, or unauthorized use of the Services.

## 3. Data Sharing and Disclosure

We do not sell your personal information to third parties. We may share your information only under the following circumstances:

- **Aggregated and Anonymized Data:** We may share usage information in an aggregated, anonymized form that cannot identify you.

- **Service Providers:** We may share personal information with third-party service providers who perform functions on our behalf, such as hosting and data storage. These providers are obligated to use your information solely for providing the services requested by us.

- **Legal Requirements:** We may disclose your personal information if required by law or to comply with a legal process, such as a subpoena, court order, or government inquiry.

- **Business Transfers:** In the event of a merger, acquisition, or asset sale, your personal information may be transferred as part of that transaction.

## 4. Data Retention

We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law.

## 5. Your Data Rights

Depending on your jurisdiction, you may have the following rights regarding your personal information:

- **Access:** You may request access to the personal information we have collected about you.
- **Correction:** You may request that we correct any inaccurate or incomplete personal information.
- **Deletion:** You may request that we delete your personal information, subject to certain legal and business-related exceptions.
- **Opt-Out of Marketing Communications:** You can opt out of receiving promotional emails by following the unsubscribe instructions in those emails.

If you are a resident of the European Union or California, you may have additional rights under the GDPR or CCPA. To exercise any of these rights, please contact us at legal@zestyfinance.com.

## 6. Security

We implement reasonable administrative, technical, and physical safeguards to protect your personal data, including encrypted data transmission (HTTPS) and hashed password storage. However, no method of transmission over the Internet is 100% secure.

In the event of a data breach, we will take prompt measures to investigate and mitigate the situation and notify affected users as required by applicable law.

## 7. Children's Privacy

Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from minors.

## 8. Changes to This Policy

We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of the Services after such changes constitutes your acceptance of the updated Privacy Policy. For material changes, we will notify you via email.

## 9. Contact Us

**Zesty Finance**
legal@zestyfinance.com`;

const termsOfServiceContent = `Welcome to Zesty Finance (the "Service"). The following terms and conditions (the "Terms") govern your use of our personal finance tracking and analysis tools. By accessing or using the Service, you agree to be bound by these Terms.

## 1. Acceptance of Terms

By using this Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. These Terms constitute a legally binding agreement between you and Zesty Finance.

## 2. Eligibility

You must be at least 18 years old and legally capable of entering into contracts in your jurisdiction to use the Services.

## 3. Use of Services

- **Informational Purposes Only:** Zesty Finance provides tools for tracking and analyzing your personal finances. The information and analysis provided is for your personal informational purposes only and does not constitute financial, investment, legal, tax, or other professional advice.

- **No Guarantee of Accuracy:** Zesty Finance makes no guarantees regarding the accuracy, reliability, or completeness of any data, calculations, or content within the Service.

- **Personal Use:** The Service is intended for your personal, non-commercial use.

## 4. User Responsibilities

- **Accuracy of Data:** You are responsible for the accuracy of the financial data you enter into the Service.

- **Account Security:** You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately at legal@zestyfinance.com if you suspect unauthorized access.

- **Compliance with Laws:** You agree to comply with all applicable laws, rules, and regulations when using the Service.

- **Prohibited Activities:** You agree not to attempt to breach the security of the Service, use automated systems to access the Service, transmit malicious code, or interfere with the integrity of the Service.

## 5. No Financial or Professional Advice

Zesty Finance is not a registered financial advisor, broker, dealer, investment advisor, or tax professional. Nothing in the Service should be construed as financial, investment, legal, or tax advice.

## 6. Limitation of Liability

- **No Warranty:** The Service is provided on an "as-is" and "as-available" basis without warranties of any kind.

- **Limitation of Damages:** To the fullest extent permitted by applicable law, Zesty Finance shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.

- **Cap on Liability:** Zesty Finance's total liability shall not exceed the amount you paid in the twelve months preceding the claim, or $100, whichever is greater.

## 7. Indemnification

You agree to indemnify and hold harmless Zesty Finance and its affiliates from and against any claims, liabilities, damages, and expenses arising out of your use or misuse of the Service or violation of these Terms.

## 8. Privacy and Data

Your use of the Service is subject to our Privacy Policy, which is incorporated into these Terms by reference.

## 9. Modifications to the Service

Zesty Finance reserves the right to modify, suspend, or discontinue any part of the Service at any time with or without notice.

## 10. Termination

We reserve the right to suspend or terminate your access to the Service at our sole discretion for conduct that violates these Terms.

## 11. Governing Law and Dispute Resolution

These Terms are governed by the laws of the State of Delaware, United States. Any dispute shall be submitted to binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules in Delaware.

## 12. Changes to These Terms

We may update these Terms from time to time. Your continued use of the Service after changes are posted constitutes your acceptance of the updated Terms. For material changes, we will notify you via email.

## 13. Contact Information

**Zesty Finance**
legal@zestyfinance.com

---

By using the Service, you acknowledge that you have read, understood, and agree to these Terms of Service.`;

export const up = async (db: Kysely<any>): Promise<void> => {
  // document_types — reference table for document categories
  await db.schema
    .createTable('document_types')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v7()`),
    )
    .addColumn('slug', 'varchar(100)', (col) => col.notNull().unique())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(now() at time zone 'utc')`),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(now() at time zone 'utc')`),
    )
    .execute();

  await sql`
    CREATE OR REPLACE TRIGGER set_updated_at
    BEFORE UPDATE ON document_types
    FOR EACH ROW
    WHEN (OLD IS DISTINCT FROM NEW)
    EXECUTE FUNCTION set_updated_at();
  `.execute(db);

  // documents — versioned document content
  await db.schema
    .createTable('documents')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v7()`),
    )
    .addColumn('document_type_id', 'uuid', (col) => col.notNull())
    .addColumn('version', 'varchar(20)', (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('effective_date', 'date', (col) => col.notNull())
    .addColumn('is_active', 'boolean', (col) =>
      col.notNull().defaultTo(false),
    )
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(now() at time zone 'utc')`),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(now() at time zone 'utc')`),
    )
    .execute();

  await db.schema
    .alterTable('documents')
    .addForeignKeyConstraint(
      'documents_document_type_id_fk',
      ['document_type_id'],
      'document_types',
      ['id'],
      (fk) => fk.onUpdate('cascade').onDelete('restrict'),
    )
    .execute();

  await db.schema
    .alterTable('documents')
    .addUniqueConstraint('documents_type_version_key', [
      'document_type_id',
      'version',
    ])
    .execute();

  // Enforce only one active document per type at the DB level
  await sql`
    CREATE UNIQUE INDEX documents_one_active_per_type
    ON documents (document_type_id)
    WHERE is_active = TRUE;
  `.execute(db);

  await sql`
    CREATE OR REPLACE TRIGGER set_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    WHEN (OLD IS DISTINCT FROM NEW)
    EXECUTE FUNCTION set_updated_at();
  `.execute(db);

  // Seed document types
  await db
    .insertInto('document_types')
    .values([
      { slug: 'privacy-policy', name: 'Privacy Policy' },
      { slug: 'terms-of-service', name: 'Terms of Service' },
    ])
    .execute();

  // Seed v1.0 of each document
  const effectiveDate = '2026-03-27';

  const types = await db
    .selectFrom('document_types')
    .select(['id', 'slug'])
    .execute();

  const privacyType = types.find((t) => t.slug === 'privacy-policy');
  const termsType = types.find((t) => t.slug === 'terms-of-service');

  await db
    .insertInto('documents')
    .values([
      {
        document_type_id: privacyType!.id,
        version: '1.0',
        content: privacyPolicyContent,
        effective_date: effectiveDate,
        is_active: true,
      },
      {
        document_type_id: termsType!.id,
        version: '1.0',
        content: termsOfServiceContent,
        effective_date: effectiveDate,
        is_active: true,
      },
    ])
    .execute();
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await db.schema.dropTable('documents').ifExists().execute();
  await db.schema.dropTable('document_types').ifExists().execute();
};
