import { useState } from "react"
import { ArrowRight, Mail, Plus, Sparkles, Trash2 } from "lucide-react"
import {
  Button,
  Input,
  SearchInput,
  Select,
  Chip,
  Badge,
  StatusBadge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Checkbox,
  Toggle,
} from "@/components/ui"

export function ComponentPreviewPage() {
  // Interactive state
  const [searchValue, setSearchValue] = useState("Orthodontists")
  const [selectedIndustry, setSelectedIndustry] = useState("health")
  const [selectedChips, setSelectedChips] = useState<string[]>(["dental", "dubai"])
  const [checkbox1, setCheckbox1] = useState(true)
  const [checkbox2, setCheckbox2] = useState<boolean | "indeterminate">("indeterminate")
  const [toggleState, setToggleState] = useState(true)
  const [isLoadingBtn, setIsLoadingBtn] = useState(false)

  const toggleChip = (id: string) => {
    setSelectedChips((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const removeChip = (id: string) => {
    setSelectedChips((prev) => prev.filter((item) => item !== id))
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Page Header */}
        <div className="border-b border-border pb-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Kinetix Design System
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Group A (Base Primitives) preview. All styling is 100% token-driven through Phase 1 CSS
            variables.
          </p>
        </div>

        {/* 1. BUTTONS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              1. Buttons
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsLoadingBtn(true)
                setTimeout(() => setIsLoadingBtn(false), 1500)
              }}
            >
              Simulate Loading
            </Button>
          </div>

          <Card>
            <CardContent className="space-y-6 pt-5">
              {/* Variants */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">Variants</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary Action</Button>
                  <Button variant="secondary">Secondary Action</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="destructive" leftIcon={<Trash2 className="size-4" />}>
                    Delete Run
                  </Button>
                  <Button variant="link">Text Link</Button>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">Sizes</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small (h-8)</Button>
                  <Button size="md">Medium (h-9)</Button>
                  <Button size="lg" rightIcon={<ArrowRight className="size-4" />}>
                    Large (h-10)
                  </Button>
                  <Button size="icon" aria-label="Add item">
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              {/* States */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">States</span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" isLoading={isLoadingBtn}>
                    {isLoadingBtn ? "Processing…" : "Click Loading"}
                  </Button>
                  <Button variant="secondary" isLoading={true}>
                    Always Loading
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled Primary
                  </Button>
                  <Button variant="secondary" disabled>
                    Disabled Secondary
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. INPUTS & SEARCH */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            2. Inputs & Search
          </h2>
          <Card>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Standard Input</label>
                <Input placeholder="name@company.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Input with Icon</label>
                <Input leftIcon={<Mail className="size-4" />} placeholder="Enter lead email" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  SearchInput with Clear
                </label>
                <SearchInput
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onClear={() => setSearchValue("")}
                  placeholder="Search prospects..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Error State</label>
                <Input error defaultValue="invalid-domain" placeholder="Domain name" />
                <span className="text-xs text-destructive">Please enter a valid URL</span>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Disabled Input</label>
                <Input disabled value="read-only-api-key-xyz" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 3. SELECT & DROPDOWN */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            3. Select / Dropdown
          </h2>
          <Card>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Industry Selector</label>
                <Select
                  value={selectedIndustry}
                  onChange={setSelectedIndustry}
                  options={[
                    { value: "health", label: "Healthcare & Dental" },
                    { value: "legal", label: "Legal & Law Firms" },
                    { value: "plumbing", label: "Home Services & Plumbing" },
                    { value: "enterprise", label: "Enterprise B2B (Disabled)", disabled: true },
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Disabled Select</label>
                <Select
                  disabled
                  defaultValue="locked"
                  options={[{ value: "locked", label: "Workspace Locked" }]}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 4. CHIPS & BADGES */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            4. Chips & Badges
          </h2>
          <Card>
            <CardContent className="space-y-6 pt-5">
              {/* Chips */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Interactive Filter Chips (Click to toggle)
                </span>
                <div className="flex flex-wrap gap-2">
                  <Chip
                    selected={selectedChips.includes("dental")}
                    onClick={() => toggleChip("dental")}
                    removable
                    onRemove={() => removeChip("dental")}
                  >
                    Dentists
                  </Chip>
                  <Chip
                    selected={selectedChips.includes("dubai")}
                    onClick={() => toggleChip("dubai")}
                    removable
                    onRemove={() => removeChip("dubai")}
                  >
                    Dubai, UAE
                  </Chip>
                  <Chip
                    selected={selectedChips.includes("mobile")}
                    onClick={() => toggleChip("mobile")}
                  >
                    Slow Mobile Site
                  </Chip>
                  <Chip disabled>Disabled Filter</Chip>
                </div>
              </div>

              {/* Status Badges */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Status Badges (Pill Shape)
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status="completed" />
                  <StatusBadge status="in-progress" />
                  <StatusBadge status="failed" />
                  <StatusBadge status="cancelled" />
                </div>
              </div>

              {/* Generic Badges */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Generic Pill Badges
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="default">200 prospects</Badge>
                  <Badge variant="secondary">Aura Active</Badge>
                  <Badge variant="outline">240 credits</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 5. TABS & CARDS */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            5. Tabs & Cards
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Tabbed Module</CardTitle>
              <CardDescription>
                Radix-style keyboard-accessible tab switches styled through Kinetix tokens.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="prospects">Prospects (24)</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <div className="mt-4 rounded-lg border border-border bg-card p-4">
                  <TabsContent value="overview">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This is the overview tab panel. It uses flat surfaces, zero drop-shadows, and
                      hairline borders.
                    </p>
                  </TabsContent>
                  <TabsContent value="prospects">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Prospect list panel with 24 discovered local business leads.
                    </p>
                  </TabsContent>
                  <TabsContent value="settings">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Configuration settings for lead enrichment workflows.
                    </p>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Status: Synchronized with Phase 1 tokens</span>
              <span className="font-medium text-foreground">v1.0.0</span>
            </CardFooter>
          </Card>
        </section>

        {/* 6. CHECKBOX & TOGGLE */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            6. Checkbox & Toggle Switch
          </h2>
          <Card>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
              <div className="space-y-3">
                <span className="text-xs font-medium text-muted-foreground">Checkboxes</span>
                <div className="space-y-2.5">
                  <Checkbox
                    id="cb1"
                    checked={checkbox1}
                    onCheckedChange={setCheckbox1}
                    label="Auto-enrich phone numbers"
                    description="Spend 1 credit per verified direct line"
                  />
                  <Checkbox
                    id="cb2"
                    checked={checkbox2}
                    onCheckedChange={(val) => setCheckbox2(val)}
                    label="Indeterminate batch selection"
                    description="12 of 24 prospects selected"
                  />
                  <Checkbox
                    id="cb3"
                    disabled
                    label="Disabled requirement"
                    description="Requires upgraded tier"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-medium text-muted-foreground">Toggle Switches</span>
                <div className="space-y-3">
                  <Toggle
                    id="tg1"
                    checked={toggleState}
                    onCheckedChange={setToggleState}
                    label="Real-time Aura monitoring"
                    description="Receive alerts when prospects open emails"
                  />
                  <Toggle id="tg2" size="sm" defaultChecked={false} label="Compact Toggle (sm)" />
                  <Toggle id="tg3" disabled defaultChecked={true} label="Disabled Active Toggle" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
