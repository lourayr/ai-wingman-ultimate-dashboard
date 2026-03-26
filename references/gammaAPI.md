gammaAPI
Gamma Developer Docs
Build with the Gamma API — generate presentations, documents, websites, and social posts programmatically.

One API call. Polished presentations, documents, websites, and social posts — branded, exported, and shared.

Get your API key
API overview


Authentication
All requests require an API key in the X-API-KEY header. Generate a key from Account Settings > API Keys.

Header
Value
Required
X-API-KEY

Your API key

Yes

Content-Type

application/json

Yes

API key access requires a Pro, Ultra, Teams, or Business plan. Some connectors work on all plans and do not require an API key.

Machine-readable docs are available at developers.gamma.app/llms.txt and developers.gamma.app/llms-full.txt. Every page is also available as markdown by appending .md to the URL.

Quickstart
1. Start a generation
cURL
Python
JavaScript

Copy
curl -X POST https://public-api.gamma.app/v1.0/generations \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: $GAMMA_API_KEY" \
  -d '{
    "inputText": "Q3 product launch strategy",
    "textMode": "generate",
    "format": "presentation",
    "numCards": 10,
    "exportAs": "pdf"
  }'
Response

Copy
{
  "generationId": "abc123xyz"
}
2. Poll for the result
Poll GET /v1.0/generations/{generationId} every 5 seconds until status is completed or failed. Full polling examples in Poll for results.

Response (completed)

Copy
{
  "generationId": "abc123xyz",
  "status": "completed",
  "gammaUrl": "https://gamma.app/docs/abc123",
  "exportUrl": "https://gamma.app/export/abc123.pdf",
  "credits": {
    "deducted": 15,
    "remaining": 485
  }
}
3. Use your Gamma
Your presentation is live at gammaUrl. If you specified exportAs, the file is ready at exportUrl.

Getting a 401? Gamma uses X-API-KEY as a custom header — not Authorization: Bearer. See Error codes for other common issues.

Endpoints
Endpoint
Method
Description
/generations

POST

Generate from text

/generations/from-template

POST

Generate from template

/generations/{id}

GET

Poll generation status

/themes

GET

List workspace themes

/folders

GET

List workspace folders

Building an AI integration? The MCP server lets AI tools create gammas on behalf of users via OAuth with Dynamic Client Registration.

Next steps
Generate from text

Control format, themes, images, headers/footers, and sharing.

Generate from a template

Design a template once, then generate variations programmatically.

Connect integrations

Use Gamma with AI assistants and automation platforms — some require no API key.

Set up the MCP server

Let AI tools create gammas on behalf of users via OAuth.

Next
Explore the API
Last updated 4 hours ago

#Explore the API
How the Gamma API works, what it can do, and which endpoint to use.

The Gamma API generates polished presentations, documents, websites, and social posts from text. Everything runs asynchronously: you create a generation, poll for status, and retrieve the result.

Use this page to decide which workflow fits your use case. When you need the exact request schema, field types, or response contract, see the individual endpoint reference pages.

How it works
Create a generation

POST /v1.0/generations with your content and parameters. You get back a generationId.

Poll for status

GET /v1.0/generations/{generationId} every 5 seconds until status is completed or failed.

Get your result

The completed response includes gammaUrl (view it in Gamma) and exportUrl (download as PDF, PPTX, or PNG).

See Poll for results for full implementation examples in Python, JavaScript, and cURL.

Quick reference
Use POST /v1.0/generations when you want Gamma to create the layout from your prompt and parameters.

Use POST /v1.0/generations/from-template when you already have a Gamma template and want repeated outputs in the same structure.

Poll GET /v1.0/generations/{generationId} until status is completed or failed.

Use GET /v1.0/themes and GET /v1.0/folders to look up IDs before generation.

Two ways to generate
Generate API
Create from Template API
Endpoint

POST /v1.0/generations

POST /v1.0/generations/from-template

When to use

Creating from scratch. Maximum flexibility — you control format, tone, audience, images, layout, and more.

Producing variations of a consistent layout. Design the template once in the Gamma app, then generate new content into it.

Required fields

inputText + textMode

prompt + gammaId

Key difference

AI determines the layout based on your parameters.

Layout stays fixed to your template. Only the content changes.

Both endpoints support themeId, exportAs, sharingOptions, and folderIds. See the full parameter reference for each:

Generate API Parameters

Create from Template Parameters

Key parameters at a glance
Parameter
What it controls
Example values
format

Output type

presentation, document, webpage, social

textMode

How input text is interpreted

generate (topic → content), condense (summarize), preserve (keep as-is)

themeId

Brand theme (colors, fonts, logo)

Get IDs from GET /v1.0/themes

numCards

Number of slides/sections

1–75 depending on plan

exportAs

Auto-export on completion

pdf, pptx, png

imageOptions.source

Where images come from

aiGenerated, webFreeToUseCommercially, noImages

textOptions.tone

Writing style

Any string: "professional", "casual", "academic"

textOptions.audience

Who the content is for

Any string: "executives", "new hires", "students"

cardOptions.headerFooter

Logo, page numbers, text

6 positions per card — see Header and Footer Formatting

sharingOptions

Permissions on the generated gamma

Workspace, external link, and email access levels

Supporting endpoints
Endpoint
Purpose
GET /v1.0/themes

List available themes (standard + custom workspace themes). Use the id as themeId.

GET /v1.0/folders

List workspace folders. Use folder id values in folderIds.

Both list endpoints use cursor-based pagination: check hasMore, pass nextCursor as the after query param.

Authentication
All requests require an API key in the X-API-KEY header. Generate your key from Account Settings > API Keys.


Copy
curl https://public-api.gamma.app/v1.0/themes \
  -H "X-API-KEY: $GAMMA_API_KEY"
API access requires a Pro, Ultra, Teams, or Business plan. See Access and Pricing for credit costs and plan details.

Not a developer? You can also use Gamma through connectors and integrations — no code required.

Related
Generate from text for a parameter-by-parameter walkthrough of POST /v1.0/generations

Generate from a template for the fixed-layout workflow

Poll for results for complete polling implementations

#Generate from text
When to use the Generate endpoint and how to choose the parameters that shape the output.

Use this page when you already know you want POST /v1.0/generations and need help deciding how each parameter affects the output.

This page explains when and why to use each parameter. For the exact request body, field types, and response schema, see the POST /generations and GET /generations/{id} endpoint reference pages.

Quick reference
inputText is always required.

textMode controls whether Gamma expands, condenses, or preserves your source text.

format, themeId, imageOptions, and cardOptions shape the look and output type.

Poll GET /v1.0/generations/{generationId} to retrieve gammaUrl, exportUrl, and credit usage after creation.

Top-level parameters
inputText (required)
Content used to generate your gamma, including text and image URLs.

Add images to the input

You can provide URLs for specific images you want to include. Simply insert the URLs into your content where you want each image to appear (see example below). You can also add instructions for how to display the images in additionalInstructions, eg, "Group the last 10 images into a gallery to showcase them together."

Note: If you want your gamma to use only the images you provide (and not generate additional ones), set imageOptions.source to noImages.

Token limits

The token limit is 100,000, which is approximately 400,000 characters. However, in some cases, the token limit may be lower, especially if your use case requires extra reasoning from our AI models. We highly recommend keeping inputText below 100,000 tokens and testing out a variety of inputs to get a good sense of what works for your use case.

Other tips

Text can be as little as a few words that describe the topic of the content you want to generate.

You can also input longer text -- pages of messy notes or highly structured, detailed text.

You can control where cards are split by adding \n---\n to the text.

You may need to apply JSON escaping to your text. Find out more about JSON escaping and try it out here.

Example

Copy
"inputText": "Ways to use AI for productivity"
Example

Copy
"inputText": "# The Final Frontier: Deep Sea Exploration\n* Less than 20% of our oceans have been explored\n* Deeper than 1,000 meters remains largely mysterious\n* More people have been to space than to the deepest parts of our ocean\n\nhttps://img.genially.com/5b34eda40057f90f3a45b977/1b02d693-2456-4379-a56d-4bc5e14c6ae1.jpeg\n---\n# Technological Breakthroughs\n* Advanced submersibles capable of withstanding extreme pressure\n* ROVs (Remotely Operated Vehicles) with HD cameras and sampling tools\n* Autonomous underwater vehicles for extended mapping missions\n* Deep-sea communication networks enabling real-time data transmission\n\nhttps://images.encounteredu.com/excited-hare/production/uploads/subject-update-about-exploring-the-deep-hero.jpg?w=1200&h=630&q=82&auto=format&fit=crop&dm=1631569543&s=48f275c76c565fdaa5d4bd365246afd3\n---\n# Ecological Discoveries\n* Unique ecosystems thriving without sunlight\n* Hydrothermal vent communities using chemosynthesis\n* Creatures with remarkable adaptations: bioluminescence, pressure resistance\n* Thousands of new species discovered annually\n---\n# Scientific & Economic Value\n* Understanding climate regulation and carbon sequestration\n* Pharmaceutical potential from deep-sea organisms\n* Mineral resources and rare earth elements\n* Insights into extreme life that could exist on other planets\n\nhttps://publicinterestnetwork.org/wp-content/uploads/2023/11/Western-Pacific-Jarvis_PD_NOAA-OER.jpg\n---\n# Future Horizons\n* Expansion of deep-sea protected areas\n* Sustainable exploration balancing discovery and conservation\n* Technological miniaturization enabling broader coverage\n* Citizen science initiatives through shared deep-sea data"
textMode (required)
Determines how your inputText is modified, if at all.

You can choose between generate, condense, or preserve

generate: Using your inputText as a starting point, Gamma will rewrite and expand the content. Works best when you have brief text in the input that you want to elaborate on.

condense: Gamma will summarize your inputText to fit the content length you want. Works best when you start with a large amount of text that you'd like to summarize.

preserve: Gamma will retain the exact text in inputText, sometimes structuring it where it makes sense to do so, eg, adding headings to sections. (If you do not want any modifications at all, you can specify this in the additionalInstructions parameter.)

Example

Copy
"textMode": "generate"
format (optional, defaults topresentation)
Determines the artifact Gamma will create for you.

You can choose between presentation, document, social, or webpage.

You can use the cardOptions.dimensionsfield to further specify the shape of your output.

Example

Copy
"format": "presentation"
themeId (optional, defaults to workspace default theme)
Defines which theme from Gamma will be used for the output. Themes determine the look and feel of the gamma, including colors and fonts.

Use GET /v1.0/themes to list themes from your workspace, or copy the theme ID directly from the app.

Theme ID location in Gamma
Copy the theme ID from the app
Example

Copy
"themeId": "abc123def456ghi"
numCards (optional, defaults to10)
Determines how many cards are created if auto is chosen in cardSplit

Pro, Teams, and Business plans: 1 to 60 cards.

Ultra plan: 1 to 75 cards.


Copy
"numCards": 10
cardSplit (optional, defaults toauto)
Determines how your content will be divided into cards.

You can choose between auto or inputTextBreaks

Choosing auto tells Gamma to looks at the numCards field and divide up content accordingly. (It will not adhere to text breaks \n---\n in your inputText.)

Choosing inputTextBreaks tells Gamma that it should look for text breaks \n---\n in your inputText and divide the content based on this. (It will not respect numCards.)

Note: One \n---\n = one break, ie, text with one break will produce two cards, two break will produce three cards, and so on.

Here are some scenarios to guide your use of these parameters and explain how they work

inputText contains \n---\n and how many
cardSplit
numCards
output has
No

auto

9

9 cards

No

auto

left blank

10 cards (default)

No

inputTextBreaks

9

1 card

Yes, 5

auto

9

9 cards

Yes, 5

inputTextBreaks

9

6 cards


Copy
"cardSplit": "auto"
additionalInstructions (optional)
Helps you add more specifications about your desired output.

You can add specifications to steer content, layouts, and other aspects of the output.

Works best when the instructions do not conflict with other parameters, eg, if the textMode is defined as condense, and the additionalInstructions say to preserve all text, the output will not be able to respect these conflicting requests.

Character limits: 1-5000.


Copy
"additionalInstructions": "Make the card headings humorous and catchy"
Pro tip: Use additionalInstructions for aesthetic feedback

This field is especially powerful for specific visual and stylistic guidance that doesn't fit elsewhere:

Layout preferences: "Use a gallery layout for the product images", "Keep text on the left side of cards"

Visual style: "Make it feel modern and minimalist", "Use bold colors and dynamic compositions"

Tone adjustments: "Make headlines punchy and attention-grabbing", "Keep the overall vibe professional but approachable"

Specific formatting: "Use bullet points instead of paragraphs", "Include a summary card at the end"

The more specific you are, the better the results!

folderIds (optional)
Defines which folder(s) your gamma is stored in.

Use GET /v1.0/folders to list folders, or copy the folder ID directly from the app.

You must be a member of a folder to add gammas to it.

Folder ID location in Gamma
Copy the folder ID from the app

Copy
"folderIds": ["123abc456def", "456123abcdef"]
exportAs (optional)
Indicates if you'd like to return the generated gamma as an exported file as well as a Gamma URL.

Options are pdf, pptx, or png

Export URLs are signed and expire after approximately one week. Download promptly after generation completes.

If you do not wish to directly export via the API, you may always do so later via the app.

One export format per request. You can export to PDF, PPTX, or PNG, but not multiple formats in a single API call. If you need multiple formats, make separate generation requests or export additional formats manually from the Gamma app.

Example

Copy
"exportAs": "pdf"
textOptions
textOptions.amount (optional, defaults to medium)

Influences how much text each card contains. Relevant only if textMode is set to generate or condense.

You can choose between brief, medium, detailed or extensive

Example

Copy
"textOptions": {
    "amount": "detailed"
  }
textOptions.tone (optional)

Defines the mood or voice of the output. Relevant only if textMode is set to generate.

You can add one or multiple words to hone in on the mood/voice to convey.

Character limits: 1-500.

Example

Copy
"textOptions": {
    "tone": "neutral"
  }
Example

Copy
"textOptions": {
    "tone": "professional, upbeat, inspiring"
  }
textOptions.audience (optional)

Describes who will be reading/viewing the gamma, which allows Gamma to cater the output to the intended group. Relevant only if textMode is set to generate.

You can add one or multiple words to hone in on the intended viewers/readers of the gamma.

Character limits: 1-500.

Example

Copy
"textOptions": {
    "audience": "outdoors enthusiasts, adventure seekers"
  }
Example

Copy
"textOptions": {
    "audience": "seven year olds"
  }
textOptions.language (optional, defaults to en)

Determines the language in which your gamma is generated, regardless of the language of the inputText.

You can choose from the languages listed in Output language accepted values.

Example

Copy
"textOptions": {
    "language": "en"
  }
imageOptions
imageOptions.source (optional, defaults to aiGenerated)

Determines where the images for the gamma are sourced from. You can choose from the options below. If you are providing your own image URLs in inputText and want only those to be used, set imageOptions.source to noImages to indicate that Gamma should not generate additional images.

Options for source

Notes

aiGenerated

If you choose this option, you can also specify the imageOptions.model you want to use as well as an imageOptions.style. These parameters do not apply to other source options.

pictographic

Pulls images from Pictographic.

pexels

Gets images from Pexels.

giphy

Gets GIFs from Giphy.

webAllImages

Pulls the most relevant images from the web, even if licensing is unknown.

webFreeToUse

Pulls images licensed for personal use.

webFreeToUseCommercially

Gets images licensed for commercial use, like a sales pitch.

themeAccent

Uses accent images from your selected theme.

placeholder

Creates a gamma with placeholders for which images can be manually added later.

noImages

Creates a gamma with no images. Select this option if you are providing your own image URLs in inputText and want only those in your gamma.

Example

Copy
"imageOptions": {
    "source": "aiGenerated"
  }
imageOptions.model (optional)

This field is relevant if the imageOptions.source chosen is aiGenerated. The imageOptions.model parameter determines which model is used to generate images.

You can choose from the models listed in Image model accepted values.

If no value is specified for this parameter, Gamma automatically selects a model for you.

Example

Copy
"imageOptions": {
	"model": "flux-1-pro"
  }
imageOptions.style (optional)

This field is relevant if the imageOptions.source chosen is aiGenerated. The imageOptions.style parameter influences the artistic style of the images generated. While this is an optional field, we highly recommend adding some direction here to create images in a cohesive style.

You can add one or multiple words to define the visual style of the images you want.

Adding some direction -- even a simple one word like "photorealistic" -- can create visual consistency among the generated images.

Character limits: 1-500.

Example

Copy
"imageOptions": {
	"style": "minimal, black and white, line art"
  }
What about accent images?

Accent images are automatically placed by Gamma - they cannot be directly controlled via the API.

Accent images are large, decorative images that enhance the visual appeal of cards. Gamma's AI automatically determines:

Whether to include an accent image on each card

Where to place it (left, right, top, or background)

What image to use (based on your content and imageOptions settings)

The placement works best with fixed-dimension formats like 16x9 presentations. If you need more control over images, consider providing specific image URLs directly in your inputText.

Providing your own image URLs

When including image URLs in your inputText, follow these best practices to avoid broken images:

Use long-lived or permanent URLs

Gamma stores references to your image URLs. If the URL expires or becomes inaccessible, the image will appear broken in your presentation.

For S3/Cloud Storage signed URLs:

Set expiration to at least 7 days (longer is better)

Consider using permanent public URLs or CDN links instead

Test that URLs are accessible before submitting

Avoid:

Short-lived signed URLs (< 24 hours)

URLs that require authentication headers

Localhost or internal network URLs

URL Type
Recommended
Notes
Public CDN (Cloudflare, CloudFront)

✅ Yes

Permanent, fast, reliable

S3 signed URL (7+ days)

✅ Yes

Works if expiration is long enough

S3 signed URL (< 24 hours)

❌ No

Will break after expiration

Google Drive/Dropbox share links

⚠️ Maybe

Can break if permissions change

Imgur, hosted image services

✅ Yes

Generally permanent

Localhost / 192.168.x.x

❌ No

Not accessible to Gamma servers

Testing your URLs: Before submitting a generation request, open each image URL in an incognito browser window. If you can see the image without logging in, Gamma can access it too.

cardOptions
cardOptions.dimensions (optional)

Determines the aspect ratio of the cards to be generated. Fluid cards expand with your content. Not applicable if format is webpage.

Options if format is presentation: fluid (default), 16x9, 4x3

Options if format is document: fluid (default), pageless, letter, a4

Options if format is social: 1x1, 4x5(default) (good for Instagram posts and LinkedIn carousels), 9x16 (good for Instagram and TikTok stories)

Only the values listed above are accepted — custom ratios or pixel dimensions are not supported. The dimensions value must also be valid for the chosen format. If they don't match, the API applies a default for that format and includes a warning in the response.

Example

Copy
"cardOptions": {
  "dimensions": "16x9"
}
cardOptions.headerFooter (optional)

Allows you to specify elements in the header and footer of the cards. Not applicable if format is webpage.

Step 1: Pick which positions you want to populate. Options: topLeft, topRight, topCenter, bottomLeft, bottomRight, bottomCenter.

Step 2: For each position, specify what type of content goes there. Options: text, image, and cardNumber.

Step 3: Configure based on type.

For text, define a value (required)

For image:

Set the source. Options: themeLogo or customimage (required)

Set the size . Options:sm, md, lg, xl (optional)

For acustom image, define a src image URL (required)

For cardNumber, no additional configuration is available.

Step 4: For any position, you can control whether it appears on the first or last card:

hideFromFirstCard (optional) - Set to true to hide from first card. Default: false

hideFromLastCard (optional) - Set to true to hide from last card. Default: false

Example

Copy
"cardOptions": {
    "headerFooter": {
      "topRight": {
        "type": "image",
        "source": "themeLogo",
        "size": "sm"
      },
      "bottomRight": {
        "type": "cardNumber"
      },
      "hideFromFirstCard": true
    }
}
Example

Copy
"cardOptions": {
    "headerFooter": {
      "topRight": {
        "type": "image",
        "source": "custom",
        "src": "https://example.com/logo.png",
        "size": "md"
      },
      "bottomRight": {
        "type": "text",
        "value": "© 2026 Company™"
      },
      "hideFromFirstCard": true,
      "hideFromLastCard": true
    }
}
sharingOptions
sharingOptions.workspaceAccess (optional, defaults to workspace share settings)

Determines level of access members in your workspace will have to your generated gamma.

Options are: noAccess, view, comment, edit, fullAccess

fullAccessallows members from your workspace to view, comment, edit, and share with others.


Copy
"sharingOptions": {
	"workspaceAccess": "comment"
}
sharingOptions.externalAccess (optional, defaults to workspace share settings)

Determines level of access members outside your workspace will have to your generated gamma.

Options are: noAccess, view, comment, or edit

Example

Copy
"sharingOptions": {
	"externalAccess": "noAccess"
}
sharingOptions.emailOptions (optional)

Allows you to share your gamma with specific recipients via their email address.

Example

Copy
"sharingOptions": {
  "emailOptions": {
    "recipients": ["ceo@example.com", "cto@example.com"]
  }
}
sharingOptions.emailOptions.access (optional)

Determines level of access those specified in sharingOptions.emailOptions.recipients have to your generated gamma. Only workspace members can have fullAccess

Options are: view, comment, edit, or fullAccess

Example

Copy
"sharingOptions": {
  "emailOptions": {
    "access": "comment"
  }
}
Related
Generate from a template if you want to preserve an existing layout

Poll for results for the post-request workflow

Header and Footer Formatting for deeper guidance on cardOptions.headerFooter

Previous
GET /folders
Next
Generate from template