import React, { useEffect, useMemo, useState } from "react";
import { useFile } from "@dust/react-hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "shadcn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shadcn";
import { Button } from "shadcn";
import { Badge } from "shadcn";
import { Separator } from "shadcn";
import {
  Copy,
  Mail,
  CheckCircle,
  Users,
  Target,
  Building2,
  TrendingUp,
  ExternalLink,
  Map,
  ChevronDown,
  ChevronRight,
  HandCoins,
  Link as LinkIcon,
} from "lucide-react";

type TargetContact = {
  id: string;
  name: string;
  title: string;
  email: string;
  linkedin?: string;
  avatarFileId?: string;
  reason: string;
  subject: string;
  body: string;
};

type Stakeholder = {
  id: string;
  name: string;
  role: string;
  avatarFileId?: string;
  targets: TargetContact[];
};

type Stakeholders = Record<string, Stakeholder>;

type OwnerColorKey = "stakeholder_a" | "stakeholder_b" | "stakeholder_c";

const ownerColorClasses: Record<OwnerColorKey, string> = {
  stakeholder_a: "bg-blue-500 text-white border-blue-500",
  stakeholder_b: "bg-violet-500 text-white border-violet-500",
  stakeholder_c: "bg-emerald-500 text-white border-emerald-500",
};

// Softer section backgrounds for internal stakeholders (readable on white text + theme-friendly)
const ownerSectionClasses: Record<OwnerColorKey, string> = {
  stakeholder_a: "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/40",
  stakeholder_b: "bg-violet-50 border-violet-200 dark:bg-violet-950/20 dark:border-violet-900/40",
  stakeholder_c: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const copyTextReliable = async (text: string) => {
  // Primary path
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }

  // Fallback path for restricted clipboard contexts (iframes, permissions, etc.)
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
};

const stakeholders: Stakeholders = {
  stakeholder_a: {
    id: "stakeholder_a",
    name: "Alex Rivera",
    role: "Regional GM",
    avatarFileId: "fil_6VgbxhsTRXJB6O",
    targets: [
      {
        id: "riley_chen",
        name: "Riley Chen",
        title: "Chief Business Officer",
        email: "riley.chen@anonymizedco.example",
        linkedin: "https://www.linkedin.com/",
        avatarFileId: "fil_uE21YCZdFRZgC9",
        reason:
          "New senior operator driving partnerships and strategic initiatives. Peer-level conversation about scaling AI-enabled workflows.",
        subject: "Quick intro + here to help",
        body: `Hi Riley,\n\nCongrats on the new role — exciting moment to be driving growth and partnerships.\n\nYour team kicked off an internal AI workflow pilot and I wanted to reach out directly. We’re seeing strong early signals from the evaluators, and I’m here if you have any questions as you pressure-test use cases and rollout paths.\n\nIf helpful, I can also share what we’re seeing across enterprise teams building durable AI operations (governance, adoption, and measurement).\n\nBest,\nAlex`,
      },
      {
        id: "morgan_patel",
        name: "Morgan Patel",
        title: "Chief Marketing Officer",
        email: "morgan.patel@anonymizedco.example",
        linkedin: "https://www.linkedin.com/",
        avatarFileId: "fil_xioeCyZw77JvCm",
        reason:
          "Marketing orgs are often the fastest adopters (content, campaigns, analysis, and brand consistency). Strong alignment with high-value use cases.",
        subject: "Your team’s pilot — marketing use cases",
        body: `Hi Morgan,\n\nYour team started testing the platform today and I wanted to introduce myself.\n\nWe consistently see marketing teams move quickly on workflows like content production, campaign analysis, and keeping brand voice consistent at scale. I’d love to hear which use cases resonate most with your team as the pilot progresses.\n\nHere if you have any questions.\n\nBest,\nAlex`,
      },
      {
        id: "jordan_lee",
        name: "Jordan Lee",
        title: "VP Revenue Operations",
        email: "jordan.lee@anonymizedco.example",
        linkedin: "https://www.linkedin.com/",
        avatarFileId: "fil_eH6wl3DB0UomlF",
        reason:
          "Ops efficiency is usually where ROI becomes obvious: pipeline hygiene, forecasting support, enablement, and cross-functional knowledge access.",
        subject: "Pilot — RevOps workflows",
        body: `Hi Jordan,\n\nYour team kicked off a pilot today. Given your role in RevOps, wanted to flag a few common patterns we’re seeing with ops teams:\n\n- Pipeline analysis and forecasting support\n- Sales enablement content generation\n- Faster cross-functional knowledge access\n\nReach out if you want to compare notes or need support during evaluation.\n\nBest,\nAlex`,
      },
      {
        id: "taylor_brooks",
        name: "Taylor Brooks",
        title: "Director, GTM Strategy & Enablement",
        email: "taylor.brooks@anonymizedco.example",
        linkedin: "https://www.linkedin.com/",
        avatarFileId: "fil_fG9iW193dyNEIt",
        reason:
          "Enablement teams often own playbooks, onboarding, and competitive intel — core workflows for an internal knowledge + AI layer.",
        subject: "Pilot — enablement use cases",
        body: `Hi Taylor,\n\nYour team kicked off a pilot today. Given your role in GTM strategy and enablement, here are a few relevant use cases we’re seeing:\n\n- Sales playbook generation and maintenance\n- Battlecards that stay current\n- Faster onboarding with instant knowledge access\n\nLet me know if I can be helpful.\n\nBest,\nAlex`,
      },
      {
        id: "casey_nguyen",
        name: "Casey Nguyen",
        title: "Chief People Officer",
        email: "casey.nguyen@anonymizedco.example",
        linkedin: "https://www.linkedin.com/",
        avatarFileId: "fil_vomozqgO1eVZdl",
        reason:
          "People teams often use internal AI for onboarding, policy Q&A, manager enablement, and culture documentation.",
        subject: "Pilot — People team workflows",
        body: `Hi Casey,\n\nYour team started testing the platform today. People/HR teams have been some of the most engaged users — everything from onboarding to policy Q&A to manager enablement.\n\nAs organizations scale, keeping everyone aligned on “how we do things here” gets harder. That’s where we tend to help most.\n\nIf I can be helpful during evaluation, I’m around.\n\nBest,\nAlex`,
      },
    ],
  },
  stakeholder_b: {
    id: "stakeholder_b",
    name: "Sam Hart",
    role: "CEO",
    avatarFileId: "fil_7OdGD2Zm7YreMC",
    targets: [
      {
        id: "avery_morgan",
        name: "Avery Morgan",
        title: "Chief Executive Officer",
        email: "avery.morgan@anonymizedco.example",
        linkedin: "https://www.linkedin.com/",
        avatarFileId: "fil_eH6wl3DB0Uomlp",
        reason:
          "CEO-to-CEO alignment. Opportunity to trade notes on building durable internal AI systems and adoption.",
        subject: "Noticed your team testing the platform",
        body: `Hi Avery,\n\nYour team started a pilot today and I wanted to reach out directly.\n\nWe’re both building for the AI era — you’re operating a fast-scaling business, and we’re focused on making AI-assisted work reliable and measurable inside organizations.\n\nIf you’re curious what we’re seeing across enterprise adoption (governance, rollout, measurement) — or just want to swap notes — I’m around.\n\nBest,\nSam`,
      },
      {
        id: "cameron_diaz",
        name: "Cameron Diaz",
        title: "President",
        email: "cameron.diaz@anonymizedco.example",
        linkedin: "https://www.linkedin.com/",
        avatarFileId: "fil_PcNnM6CbETmUPX",
        reason:
          "Exec owner across sales, CX, and ops. Likely to influence company-wide tooling and rollout decisions.",
        subject: "Pilot — direct line if helpful",
        body: `Hi Cameron,\n\nCongrats on the expanded mandate across sales, CX, and ops.\n\nYour team kicked off a pilot today. We’ve been working closely with the evaluators, and I wanted to make sure you have a direct line to us as the pilot progresses.\n\nHere if I can help with anything — rollout planning, success metrics, or security reviews.\n\nBest,\nSam`,
      },
      {
        id: "quinn_taylor",
        name: "Quinn Taylor",
        title: "CISO / CIO",
        email: "quinn.taylor@anonymizedco.example",
        linkedin: "https://www.linkedin.com/",
        avatarFileId: "fil_Td1RnNeqQ7hAkI",
        reason:
          "Internal champion + security owner. Best place to offer exec support and ensure evaluation stays unblocked.",
        subject: "Thank you + here to help",
        body: `Hi Quinn,\n\nWanted to reach out personally to say thanks for championing the pilot.\n\nI’ll spare you the pitch — just wanted you to know I’m here as a direct line if anything comes up during evaluation. Whether it’s leadership questions, roadmap discussions, or anything else, I’m happy to jump in.\n\nAppreciate the trust. Let’s make this pilot a success.\n\nBest,\nSam`,
      },
      {
        id: "drew_bennett",
        name: "Drew Bennett",
        title: "Chief Financial Officer",
        email: "drew.bennett@anonymizedco.example",
        linkedin: "https://www.linkedin.com/",
        avatarFileId: "fil_dJ4QwP170xnCrS",
        reason:
          "Finance leadership will care about ROI framing and governance. Good to provide context early.",
        subject: "Pilot — ROI framing if useful",
        body: `Hi Drew,\n\nYour team kicked off a pilot today. Wanted to introduce myself as you’ll likely see this come across your desk.\n\nIf useful, we can share simple ROI frameworks and what we’re seeing at similar-scale organizations — both cost savings and revenue-impact workflows.\n\nHere if you have any questions.\n\nBest,\nSam`,
      },
    ],
  },
  stakeholder_c: {
    id: "stakeholder_c",
    name: "Jordan Kim",
    role: "CTO",
    avatarFileId: "fil_VZXFmQ4AU08CKM",
    targets: [
      {
        id: "bailey_park",
        name: "Bailey Park",
        title: "SVP Engineering",
        email: "bailey.park@anonymizedco.example",
        linkedin: "https://www.linkedin.com/",
        avatarFileId: "fil_vomozqgO1eVZdl",
        reason:
          "Engineering leadership often drives adoption via docs, onboarding, code review support, and knowledge discovery.",
        subject: "Pilot — engineering workflows",
        body: `Hi Bailey,\n\nYour team started testing the platform today. Engineering teams have been some of our most engaged users — from code review assistance to internal docs to onboarding new engineers faster.\n\nLet me know if I can help with anything technical during evaluation.\n\nBest,\nJordan`,
      },
      {
        id: "reese_shah",
        name: "Reese Shah",
        title: "Chief Product Officer",
        email: "reese.shah@anonymizedco.example",
        linkedin: "https://www.linkedin.com/",
        avatarFileId: "fil_uE21YCZdFRZgC9",
        reason:
          "Product teams use internal AI for spec writing, research synthesis, and competitive intel. Strong day-to-day leverage.",
        subject: "Pilot — product team use cases",
        body: `Hi Reese,\n\nYour team kicked off a pilot today. Product teams have been finding interesting use cases around:\n\n- User research synthesis and pattern recognition\n- Spec writing and PRD generation\n- Competitive intelligence gathering\n\nHere if you need anything.\n\nBest,\nJordan`,
      },
      {
        id: "parker_stone",
        name: "Parker Stone",
        title: "Engineering Leader",
        email: "parker.stone@anonymizedco.example",
        linkedin: "https://www.linkedin.com/",
        avatarFileId: "fil_xioeCyZw77JvCm",
        reason:
          "Hands-on leader perspective can help champion adoption within the engineering org.",
        subject: "Pilot — quick intro",
        body: `Hi Parker,\n\nYour team started testing the platform today. I’m reaching out to engineering leaders directly to offer support.\n\nWe’re seeing strong adoption in engineering orgs for codebase Q&A, documentation generation, and reducing context-switching overhead.\n\nReach out if I can help.\n\nBest,\nJordan`,
      },
    ],
  },
};

const ContactPhoto = ({
  name,
  fileId,
  size = "md",
}: {
  name: string;
  fileId?: string;
  size?: "sm" | "md";
}) => {
  const file = useFile(fileId || "");
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setSrc(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const cls = size === "sm" ? "w-10 h-10" : "w-14 h-14";

  if (src) {
    return <img src={src} alt={name} className={`${cls} rounded-full object-cover border`} />;
  }

  return (
    <div
      className={`${cls} rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-xs border`}
      aria-label={name}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};

const DealContext = () => (
  <Card className="border">
    <CardContent className="pt-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-muted rounded-xl">
          <Target className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2 gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold">Anonymized Executive Outreach</h2>
              <Badge variant="secondary">Pilot Live</Badge>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <a href="https://example.com/salesforce/deal" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <LinkIcon className="h-5 w-5 mr-2" />
                  Link to Salesforce Deal
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </a>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Map className="h-5 w-5 mr-2" />
                  View Account Map
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            2-week pilot kickoff <strong>January 12, 2026</strong>. Goal: create exec alignment and open
            C-level communication lines.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Opportunity Size</span>
              </div>
              <p className="text-2xl font-bold">1,250 seats</p>
            </div>
            <div className="bg-card p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <HandCoins className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Current Deal Amount</span>
              </div>
              <p className="text-2xl font-bold">$75,000</p>
            </div>
            <div className="bg-card p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Total Potential Account Value</span>
              </div>
              <p className="text-2xl font-bold">$550,000</p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const EmailCard = ({ target }: { target: TargetContact }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const doCopy = async (text: string, type: "email" | "body") => {
    setCopyError(null);
    const ok = await copyTextReliable(text);
    if (!ok) {
      setCopyError("Copy blocked by browser settings. Try selecting the text and copying manually.");
      return;
    }
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1600);
    } else {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 1600);
    }
  };

  const openGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      target.email
    )}&su=${encodeURIComponent(target.subject)}&body=${encodeURIComponent(target.body)}`;
    window.open(gmailUrl, "_blank");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <ContactPhoto name={target.name} fileId={target.avatarFileId} />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">{target.name}</CardTitle>
                <CardDescription className="text-sm">{target.title}</CardDescription>
              </div>
              {target.linkedin ? (
                <a href={target.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    LinkedIn
                  </Button>
                </a>
              ) : null}
            </div>
          </div>
        </div>
        <div className="mt-3 p-3 bg-muted rounded-lg border">
          <p className="text-sm text-foreground">
            <strong>Why reach out:</strong> {target.reason}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-16">To:</span>
            <code className="flex-1 bg-muted px-2 py-1 rounded text-sm">{target.email}</code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => doCopy(target.email, "email")}
              aria-label="Copy email address"
            >
              {copiedEmail ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-16">Subject:</span>
            <code className="flex-1 bg-muted px-2 py-1 rounded text-sm">{target.subject}</code>
          </div>
          <Separator />
          <div className="bg-muted p-4 rounded-lg border">
            <pre className="whitespace-pre-wrap text-sm font-sans text-foreground">{target.body}</pre>
          </div>

          {copyError ? (
            <p className="text-xs text-muted-foreground">{copyError}</p>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => doCopy(target.body, "body")}
              aria-label="Copy email body"
            >
              {copiedBody ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Email Body
                </>
              )}
            </Button>
            <Button className="flex-1" onClick={openGmail} aria-label="Open in Gmail">
              <Mail className="h-4 w-4 mr-2" />
              Open in Gmail
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PersonTab = ({ person }: { person: Stakeholder }) => {
  const ownerKey = person.id as OwnerColorKey;

  return (
    <div className="space-y-4">
      <Card className={`border ${ownerKey ? ownerSectionClasses[ownerKey] : ""}`}>
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center gap-5">
            <ContactPhoto name={person.name} fileId={person.avatarFileId} />
            <div>
              <h3 className="text-xl font-bold">{person.name}</h3>
              <p className="text-muted-foreground">{person.role}</p>
            </div>
            <div className="ml-auto">
              <Badge variant="outline" className="text-sm">
                {person.targets.length} contacts assigned
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium">External Stakeholders</p>
            <p className="text-xs text-muted-foreground">Contacts this internal stakeholder should email</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {person.targets.length} contacts
          </Badge>
        </div>

        <div className="space-y-4">
          {person.targets.map((target) => (
            <EmailCard key={target.id} target={target} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AnonymizedExecutiveOutreach_Avatars_v2 = () => {
  const [overviewOpen, setOverviewOpen] = useState(false);

  const overviewRows = useMemo(() => {
    const rows: Array<{ contact: TargetContact; ownerKey: string; owner: Stakeholder }> = [];
    Object.entries(stakeholders).forEach(([k, owner]) => {
      owner.targets.forEach((t) => rows.push({ contact: t, ownerKey: k, owner }));
    });
    return rows;
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <DealContext />

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Contact Overview</CardTitle>
                <CardDescription>
                  {overviewRows.length} contacts across {Object.keys(stakeholders).length} internal stakeholders
                </CardDescription>
              </div>
              <Button
                variant={overviewOpen ? "secondary" : "default"}
                onClick={() => setOverviewOpen((v) => !v)}
              >
                {overviewOpen ? (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Hide Contact Overview
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Show Contact Overview
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {overviewOpen ? (
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground"></th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Contact</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Title</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Email</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">LinkedIn</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overviewRows.map(({ contact, owner, ownerKey }, idx) => (
                      <tr
                        key={contact.id}
                        className={idx === overviewRows.length - 1 ? "" : "border-b border-muted"}
                      >
                        <td className="py-2">
                          <ContactPhoto name={contact.name} fileId={contact.avatarFileId} size="sm" />
                        </td>
                        <td className="py-2 font-medium">{contact.name}</td>
                        <td className="py-2 text-muted-foreground">{contact.title}</td>
                        <td className="py-2">
                          <code className="text-xs bg-muted px-1 rounded">{contact.email}</code>
                        </td>
                        <td className="py-2 text-right pr-2">
                          {contact.linkedin ? (
                            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                              <Button
                                variant="outline"
                                size="icon"
                                className="mr-2"
                                aria-label={`Open LinkedIn for ${contact.name}`}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground pr-2">—</span>
                          )}
                        </td>
                        <td className="py-2">
                          <Badge className={`text-xs ${ownerColorClasses[ownerKey as OwnerColorKey]}`}>
                            {owner.name}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          ) : (
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground">Contact overview is hidden.</div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="stakeholder_b" className="w-full">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium">Internal Stakeholders</p>
                  <p className="text-xs text-muted-foreground">Select an internal owner to view assigned outreach emails</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${ownerColorClasses.stakeholder_b}`}>Sam</Badge>
                  <Badge className={`text-xs ${ownerColorClasses.stakeholder_c}`}>Jordan</Badge>
                  <Badge className={`text-xs ${ownerColorClasses.stakeholder_a}`}>Alex</Badge>
                </div>
              </div>

              <div className="rounded-xl border p-3 mb-4 bg-muted/30">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                  <TabsTrigger value="stakeholder_b" className="text-sm">
                    Sam (CEO)
                  </TabsTrigger>
                  <TabsTrigger value="stakeholder_c" className="text-sm">
                    Jordan (CTO)
                  </TabsTrigger>
                  <TabsTrigger value="stakeholder_a" className="text-sm">
                    Alex (GM)
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="stakeholder_b">
                <PersonTab person={stakeholders.stakeholder_b} />
              </TabsContent>

              <TabsContent value="stakeholder_c">
                <PersonTab person={stakeholders.stakeholder_c} />
              </TabsContent>

              <TabsContent value="stakeholder_a">
                <PersonTab person={stakeholders.stakeholder_a} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Note:</strong> This frame is anonymized. Names, domains, and links are placeholders.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnonymizedExecutiveOutreach_Avatars_v2;
