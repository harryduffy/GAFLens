## Manager Selection Form

A bespoke Manager Selection Tool built for Global Alternative Funds that guides the investment team through manager due diligence and comparison.

**Problem**
- Manager selection meeting notetaking isn’t standardised → it’s difficult to efficiently compare and recall manager insights
- Notes are siloed → investment team cannot efficiently access each other’s notes/data to bolster their own workflows
- Lack of a centralised system → limited visibility, collaboration and ability to compare managers across key benchmarks
- Overreliance on investment team intuition → the current process leans heavily on senior member’s experience. If GAF were to scale and hire new team members, there’s no structured framework or process in place to guide decision-making or institutionalise manager selection thinking for junior team members

**Feature Set**
- Manager Database: searchable, filterable, groupable, sortable
- Manager Meeting Database: searchable, filterable, groupable, sortable
- Cross-Platform Linking: hyperlink access to Global Alternative Fund's SharePoint, Salesforce and Preqin to support fast cross-platform research
- Manager Selection Form: form to guide manager meetings, to institutionalise/standardise the manager selection process
- GPT-wrapper Summaries: GPT pre-prompting with Global Alternative Funds context to execute a variety of summarisation pieces (to support IC meetings, guide future meetings etc.)

**To Do**
- Enforce types on inputs to reduce human error
- Make navigation easier (particularly backwards nav)
- Summarisation (button column on each table? i.e. "summarise")
- Create drop down for GAF attendees (where you can add GAF personnel)
- Manager drop down to ensure linking with meetings page
- Database searching, filtering, sorting etc.
- Meeting display of data - how to do?
- Storing documents and images

**Minutes**
- Change inputs to be GAF and fund specific (everything is fund specific) -> get required fields from Donna
- Use Fund Name as repopulation identifier (drop down within manager search)
- Form data and recent meetings summarisation at the bottom (pdf or dashboard)(e.g. recent funds you've looked at within a manager (or by strategy...))
- DD Tier 1, DD Tier 2, DD Tier 3, declined, invested (summary of these on an excel spreadsheet), and a brief tier justification (max 3-4 sentences, enforce brevity)
- Investment Strategies populate after Asset Class is selected
- Scrap the accounts but keep authentication

**Potential Add-Ons**
- Manager pipeline visualisation – a kanban-style interface showing managers moving through stages (initial meeting, diligence, shortlist, approved etc.)
- Semantic Analysis – use natural language processing to compare qualitative notes across managers to enhance comparison
- Internal Rating System – let investment team score managers against pre-defined criteria for better comparison etc
- Statistical Analysis – can execute statistical analysis over all GAF managers (split by invested by GAF and not), such as mean Net IRR, median AUM, Net IRR vs Vintage Year etc.
- Dashboard Plots – can have cool plots (pie charts, scatter plots, box and whisker plots etc.) on the dashboard, distilling manager information for easy human parsing
- Manager playoffs – pick two managers to compare directly side-by-side
