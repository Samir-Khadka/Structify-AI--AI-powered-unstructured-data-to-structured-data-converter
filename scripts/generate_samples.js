const fs = require('fs');
const path = require('path');

const samplesDir = path.join(__dirname, '../sample_docs');

if (!fs.existsSync(samplesDir)) {
    fs.mkdirSync(samplesDir);
}

const samples = [
    {
        name: 'invoice_AcmeCorp_2023-001.txt',
        content: `INVOICE #2023-001
Date: October 24, 2023
From: Acme Corp, 123 Business Rd, Tech City
To: John Smith, 456 Client Ln, Innovation Valley

Description                 Quantity    Unit Price    Total
-----------------------------------------------------------
Web Development Services    1           $1,500.00     $1,500.00
Cloud Hosting Setup         1           $200.00       $200.00
Domain Registration         2           $15.00        $30.00

Subtotal: $1,730.00
Tax (10%): $173.00
Total Due: $1,903.00

Please pay within 30 days. Thank you for your business!`
    },
    {
        name: 'meeting_notes_product_launch.txt',
        content: `Meeting Minutes: Q4 Product Launch
Date: December 1, 2023
Attendees: Sarah (PM), Mike (Dev), Lisa (Design)

Agenda:
1. Finalize feature list for v2.0
2. Review marketing timeline
3. Set launch date

Decisions:
- Feature freeze effective immediately.
- Marketing campaign starts Dec 15th on Twitter and LinkedIn.
- Official Launch Date: January 10, 2024.

Action Items:
- Mike to deploy staging build by Friday.
- Lisa to provide 3 banners for social media.
- Sarah to draft press release.`
    },
    {
        name: 'resume_jane_doe.txt',
        content: `Jane Doe
Software Engineer
Email: jane.doe@example.com | Phone: (555) 123-4567

Summary:
Experienced Full Stack Developer with 5 years in Node.js and React. Passionate about building scalable web applications.

Experience:
Senior Developer at TechGlobal (2020-Present)
- Led a team of 4 developers.
- Reduced API latency by 40%.

Junior Developer at StartUp Inc (2018-2020)
- Built internal dashboard tools.
- Maintained legacy PHP codebase.

Education:
B.S. Computer Science, University of Technology (2018)

Skills:
JavaScript, TypeScript, Python, SQL, Docker, AWS`
    },
    {
        name: 'email_support_ticket_4592.txt',
        content: `Subject: Re: Issue with Login Page
From: Support Team <support@structify.ai>
To: Customer <user@example.com>
Date: Nov 12, 2023 09:30 AM

Hi Customer,

Thank you for reaching out. We have investigated the issue with the login page.
It appears to be a caching issue on the CDN. We have purged the cache.

Can you please try clearing your browser cache and logging in again?

Best,
Support Team

> On Nov 11, 2023, Customer wrote:
> I cannot login to my account. I get a 500 error every time.`
    },
    {
        name: 'project_proposal_chatbot.txt',
        content: `Project Proposal: AI Customer Support Chatbot
Prepared for: RetailGiant Ltd.

Objective:
Automate 60% of common customer queries using an AI-driven chatbot.

Scope:
- Intent recognition for shipping, returns, and product availability.
- Integration with existing CRM.
- 24/7 availability.

Timeline:
- Month 1: Requirement Analysis & Design
- Month 2: Development & Training
- Month 3: Testing & Deployment

Budget:
Estimated Cost: $25,000`
    },
    {
        name: 'sales_data_q3.csv',
        content: `Date,Region,Product,Units Sold,Revenue
2023-07-01,North,Widget A,100,5000
2023-07-02,South,Widget B,50,3000
2023-07-03,East,Widget A,75,3750
2023-07-04,West,Widget C,20,2000
2023-07-05,North,Widget B,60,3600
2023-07-06,South,Widget A,90,4500`
    },
    {
        name: 'employee_directory.csv',
        content: `EmployeeID,FirstName,LastName,Department,Role,Email
E101,John,Smith,Engineering,Senior Dev,john@company.com
E102,Lisa,Wong,Marketing,Manager,lisa@company.com
E103,David,Miller,Sales,Associate,david@company.com
E104,Sarah,Connor,Ops,Director,sarah@company.com
E105,James,Bond,Security,Consultant,007@company.com`
    },
    {
        name: 'product_inventory.csv',
        content: `SKU,ProductName,Category,Price,StockLevel
WID-001,Super Widget,Gadgets,49.99,150
GAD-002,Mega Gadget,Gadgets,199.99,45
TOO-003,Power Drill,Tools,89.50,30
TOO-004,Hammer,Tools,15.00,200
OFF-005,Ergo Chair,Office,250.00,10`
    },
    {
        name: 'customer_feedback_survey.csv',
        content: `ResponseID,CustomerName,Rating,Comment,Date
1,Alice G.,5,Excellent service!,2023-09-01
2,Bob T.,3,Shipping was slow.,2023-09-02
3,Charlie D.,4,Product is great but expensive.,2023-09-03
4,Diana P.,2,Arrived damaged.,2023-09-04
5,Evan R.,5,Will buy again.,2023-09-05`
    },
    {
        name: 'marketing_campaigns.csv',
        content: `CampaignID,Channel,Spend,Impressions,Clicks,Conversions
CMP-01,Facebook,1000,50000,1200,50
CMP-02,Google Ads,2500,80000,3000,120
CMP-03,Email,200,10000,500,40
CMP-04,LinkedIn,1500,25000,400,15`
    }
];

samples.forEach(file => {
    fs.writeFileSync(path.join(samplesDir, file.name), file.content);
    console.log(`Created: ${file.name}`);
});

console.log(`\nSuccessfully created ${samples.length} sample documents in 'sample_docs' folder.`);
