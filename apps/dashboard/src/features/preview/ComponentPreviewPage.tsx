import { useState } from "react"
import {
  ArrowRight,
  Download,
  Filter,
  Globe,
  Mail,
  Phone,
  Plus,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react"
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
  DataTable,
  type Column,
  BulkActionBar,
  EmptyState,
  Skeleton,
  Toast,
  Breadcrumb,
  Pagination,
  Sidebar,
  TopBar,
  CreditBalance,
  AuraAvatar,
  AuraStatusPill,
  SuggestionCard,
  ProspectCard,
  NoteItem,
  ContactRow,
  FormField,
} from "@/components/ui"

interface ProspectRow {
  id: number
  name: string
  company: string
  location: string
  credits: number
  status: "completed" | "in-progress" | "failed" | "cancelled"
}

const SAMPLE_PROSPECTS: ProspectRow[] = [
  {
    id: 1,
    name: "Dr. Tariq Mansoor",
    company: "Emirates Smile Clinic",
    location: "Dubai, UAE",
    credits: 24,
    status: "completed",
  },
  {
    id: 2,
    name: "Sarah Al-Hassan",
    company: "Gulf Orthodontics",
    location: "Dubai, UAE",
    credits: 18,
    status: "completed",
  },
  {
    id: 3,
    name: "Dr. Marcus Vance",
    company: "Dubai Marina Dental",
    location: "Dubai, UAE",
    credits: 32,
    status: "in-progress",
  },
  {
    id: 4,
    name: "Elena Rostova",
    company: "Prime Care Dentistry",
    location: "Abu Dhabi, UAE",
    credits: 12,
    status: "completed",
  },
  {
    id: 5,
    name: "Karim Benali",
    company: "Al Barsha Smiles",
    location: "Dubai, UAE",
    credits: 0,
    status: "failed",
  },
]

export function ComponentPreviewPage() {
  // Interactive state
  const [searchValue, setSearchValue] = useState("Orthodontists")
  const [selectedIndustry, setSelectedIndustry] = useState("health")
  const [selectedChips, setSelectedChips] = useState<string[]>(["dental", "dubai"])
  const [checkbox1, setCheckbox1] = useState(true)
  const [checkbox2, setCheckbox2] = useState<boolean | "indeterminate">("indeterminate")
  const [toggleState, setToggleState] = useState(true)
  const [isLoadingBtn, setIsLoadingBtn] = useState(false)

  // Group B state
  const [selectedTableIds, setSelectedTableIds] = useState<(string | number)[]>([1])
  const [tableSortKey, setTableSortKey] = useState("name")
  const [tableSortDirection, setTableSortDirection] = useState<"asc" | "desc">("asc")
  const [tablePage, setTablePage] = useState(1)
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [toastVisible, setToastVisible] = useState(true)

  // Group C state
  const [sidebarActive, setSidebarActive] = useState("find-leads")
  const [auraWorking, setAuraWorking] = useState(true)
  const [cardSelected, setCardSelected] = useState(false)

  const toggleChip = (id: string) => {
    setSelectedChips((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const removeChip = (id: string) => {
    setSelectedChips((prev) => prev.filter((item) => item !== id))
  }

  // Table Columns
  const tableColumns: Column<ProspectRow>[] = [
    {
      key: "name",
      header: "Lead Contact",
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-medium text-foreground block">{row.name}</span>
          <span className="text-xs text-muted-foreground">{row.company}</span>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      sortable: true,
      cell: (row) => <span className="text-muted-foreground">{row.location}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "credits",
      header: "Credits",
      sortable: true,
      align: "right",
      cell: (row) => (
        <span className="tabular-nums font-medium text-foreground">{row.credits} cr</span>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "right",
      cell: () => (
        <Button variant="link" size="sm">
          Inspect
        </Button>
      ),
    },
  ]

  const handleSort = (key: string) => {
    if (tableSortKey === key) {
      setTableSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setTableSortKey(key)
      setTableSortDirection("asc")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased p-6 md:p-10 pb-28">
      <div className="mx-auto max-w-5xl space-y-12">
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
            Complete interactive component library. All components are 100% token-driven with zero
            hardcoded hex colors.
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
                Keyboard-accessible tab switches styled through Kinetix tokens.
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

        {/* ======================================================== */}
        {/* GROUP B: COMPOSITE COMPONENTS */}
        {/* ======================================================== */}

        <div className="border-t border-border pt-8">
          <h2 className="text-lg font-bold tracking-tight text-foreground mb-1">
            Group B: Composite Components
          </h2>
          <p className="text-xs text-muted-foreground">
            Data tables, selection toolbars, empty states, skeletons, toasts, and pagination.
          </p>
        </div>

        {/* 7. DATA TABLE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              7. DataTable (Sortable, Selectable, Paginated)
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsTableLoading(true)
                  setTimeout(() => setIsTableLoading(false), 1200)
                }}
              >
                Simulate Skeleton
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedTableIds([1, 2, 3, 4, 5])}
              >
                Select All
              </Button>
            </div>
          </div>

          <DataTable
            data={SAMPLE_PROSPECTS}
            columns={tableColumns}
            selectable
            selectedIds={selectedTableIds}
            onSelectionChange={setSelectedTableIds}
            sortKey={tableSortKey}
            sortDirection={tableSortDirection}
            onSort={handleSort}
            isLoading={isTableLoading}
            pagination={{
              currentPage: tablePage,
              totalPages: 5,
              totalItems: 24,
              pageSize: 5,
              onPageChange: setTablePage,
            }}
          />
        </section>

        {/* 8. BREADCRUMB & PAGINATION (STANDALONE) */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            8. Breadcrumb & Standalone Pagination
          </h2>
          <Card>
            <CardContent className="space-y-6 pt-5">
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Breadcrumb Navigation
                </span>
                <Breadcrumb
                  items={[
                    { label: "Dashboard", href: "#" },
                    { label: "Prospects", href: "#" },
                    { label: "Dentists in Dubai", current: true },
                  ]}
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <span className="text-xs font-medium text-muted-foreground">
                  Standalone Pagination Bar
                </span>
                <Pagination
                  currentPage={tablePage}
                  totalPages={8}
                  totalItems={80}
                  pageSize={10}
                  onPageChange={setTablePage}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 9. TOASTS & ALERTS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              9. Toasts & Alert Banners
            </h2>
            {!toastVisible && (
              <Button variant="ghost" size="sm" onClick={() => setToastVisible(true)}>
                Restore Dismissed
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {toastVisible && (
              <Toast
                type="info"
                title="Aura has enriched 24 new contacts"
                description="Verified direct dial phone numbers and verified corporate emails added."
                onClose={() => setToastVisible(false)}
              />
            )}
            <Toast
              type="success"
              title="Export complete"
              description="Your CSV file 'Dentists_in_Dubai.csv' is ready for download."
            />
            <Toast
              type="warning"
              title="Low credit balance warning"
              description="You have 48 credits remaining. Upgrade tier to continue auto-runs."
            />
            <Toast
              type="error"
              title="Scrape failed for 2 domains"
              description="Target websites timed out. Credits have been refunded to your balance."
            />
          </div>
        </section>

        {/* 10. EMPTY STATE & SKELETON */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            10. Empty State & Skeletons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Empty State */}
            <EmptyState
              icon={<Filter className="size-6 stroke-[1.75]" />}
              title="No prospects found"
              description="No leads match your current filter combination. Try clearing some criteria."
              action={<Button size="sm">Reset Filters</Button>}
              secondaryAction={
                <Button variant="secondary" size="sm">
                  Run New Search
                </Button>
              }
            />

            {/* Skeleton Card */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" className="size-10" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton variant="text" className="w-1/2 h-3.5" />
                  <Skeleton variant="text" className="w-1/3 h-3" />
                </div>
              </div>
              <Skeleton variant="rectangle" className="h-16 w-full" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton variant="text" className="w-20 h-4" />
                <Skeleton variant="rectangle" className="w-24 h-7 rounded-lg" />
              </div>
            </Card>
          </div>
        </section>

        {/* ======================================================== */}
        {/* GROUP C: LAYOUT & AURA COMPONENTS */}
        {/* ======================================================== */}

        <div className="border-t border-border pt-8">
          <h2 className="text-lg font-bold tracking-tight text-foreground mb-1">
            Group C: Layout & Aura AI Domain
          </h2>
          <p className="text-xs text-muted-foreground">
            Navigation shell, AI assistant widgets, suggestion cards, notes, and prospect profiling
            rows.
          </p>
        </div>

        {/* 11. TOPBAR & CREDIT BALANCE */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            11. TopBar & Credit Balance
          </h2>
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <TopBar
              leftSlot={
                <span className="font-semibold text-foreground text-sm">Find Leads Workspace</span>
              }
              centerSlot={<SearchInput placeholder="Quick search..." className="h-8 text-xs" />}
              rightSlot={
                <>
                  <CreditBalance credits={2450} href="#credits" />
                  <AuraStatusPill
                    status={auraWorking ? "working" : "ready"}
                    activeTaskName="Scraping dentists in Dubai (14/200)"
                    progress={{ current: 14, total: 200 }}
                    onPause={() => setAuraWorking(false)}
                    onResume={() => setAuraWorking(true)}
                  />
                  <AuraAvatar size="sm" isWorking={auraWorking} />
                </>
              }
            />
          </div>
        </section>

        {/* 12. SIDEBAR NAVIGATION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              12. Sidebar Navigation (240px Fixed)
            </h2>
            <span className="text-xs text-muted-foreground">
              Active item: <strong className="text-foreground">{sidebarActive}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-[460px] rounded-xl border border-border overflow-hidden bg-card">
              <Sidebar
                activeId={sidebarActive}
                onNavigate={(item) => setSidebarActive(item.id)}
                user={{ name: "Alex Chen", organization: "Acme Growth", initials: "AC" }}
              />
            </div>

            <div className="md:col-span-2 space-y-5">
              {/* Aura Status Pill Standalone */}
              <Card>
                <CardHeader>
                  <CardTitle>Aura AI State Indicators</CardTitle>
                  <CardDescription>
                    Interactive status pill supporting idle standby and active background
                    enrichment. Click to toggle dropdown.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Ready Standby</span>
                      <AuraStatusPill status="ready" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground block">
                        Active Running (With Dropdown)
                      </span>
                      <AuraStatusPill
                        status="working"
                        activeTaskName="Enriching local leads in Dubai"
                        progress={{ current: 48, total: 200 }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Avatar sizes:</span>
                    <AuraAvatar size="sm" />
                    <AuraAvatar size="md" isWorking />
                    <AuraAvatar size="lg" />
                  </div>
                </CardContent>
              </Card>

              {/* FormField */}
              <Card>
                <CardHeader>
                  <CardTitle>FormField Wrapper</CardTitle>
                  <CardDescription>
                    Accessible form field with label, required asterisk, helper text, and
                    validation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Search Location"
                    htmlFor="loc"
                    required
                    description="Enter city or coordinates"
                  >
                    <Input id="loc" defaultValue="Dubai, United Arab Emirates" />
                  </FormField>
                  <FormField
                    label="Monthly Credit Cap"
                    htmlFor="cap"
                    error="Value cannot exceed organization balance (2,450 cr)"
                  >
                    <Input id="cap" defaultValue="5000" error />
                  </FormField>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 13. SUGGESTION CARDS (HOME SCREEN) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              13. Suggestion Cards (Home Recommendations)
            </h2>
            <span className="text-xs text-muted-foreground">From home.html</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <SuggestionCard
              title="Orthodontists in Dubai"
              reason="Slow mobile site found"
              meta="About 200 businesses · 240 credits"
              onStartSearch={() => alert("Starting search for Dubai Orthodontists")}
              onEditFilters={() => alert("Editing filters")}
            />
            <SuggestionCard
              title="Plumbers in Houston, TX"
              reason="No online booking found"
              meta="About 200 businesses · 240 credits"
              onStartSearch={() => alert("Starting search for Houston Plumbers")}
              onEditFilters={() => alert("Editing filters")}
            />
            <SuggestionCard
              title="Law firms in London"
              reason="Missing Google reviews"
              meta="About 200 businesses · 240 credits"
              onStartSearch={() => alert("Starting search for London Law firms")}
              onEditFilters={() => alert("Editing filters")}
            />
          </div>
        </section>

        {/* 14. PROSPECT CARD, NOTES & CONTACT CHANNELS */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            14. Prospect Cards, Notes & Contact Channels
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Prospect Card */}
            <div className="space-y-3">
              <span className="text-xs font-medium text-muted-foreground">Prospect Card</span>
              <ProspectCard
                id="prospect-1"
                company="Emirates Smile Clinic"
                name="Dr. Tariq Mansoor · Lead Specialist"
                location="Jumeirah, Dubai, UAE"
                rating={4.8}
                reviewsCount={142}
                status="completed"
                creditsCost={24}
                checked={cardSelected}
                onCheckedChange={setCardSelected}
                onInspect={() => alert("Inspecting prospect profile")}
              />
            </div>

            {/* NoteItem & ContactRow */}
            <div className="space-y-3">
              <span className="text-xs font-medium text-muted-foreground">
                Detail Profiling Primitives (NoteItem & ContactRow)
              </span>
              <NoteItem
                tag="AI suggestion"
                content="Website mobile page speed score is 34/100. Potential high-intent pitch for Web Vitals audit."
                date="Today at 10:14 AM"
                author="Aura"
              />
              <NoteItem
                tag="Observed"
                content="Clinic has 2 active job openings on LinkedIn for Dental Assistants."
                date="Yesterday"
                author="Alex Chen"
              />
              <ContactRow
                icon={<Mail className="size-4" />}
                label="Direct Email"
                value="tmansoor@emiratessmile.ae"
                tag="AI Enriched"
                href="mailto:tmansoor@emiratessmile.ae"
              />
              <ContactRow
                icon={<Phone className="size-4" />}
                label="Clinic Reception"
                value="+971 4 394 8812"
                tag="Listed on website"
              />
              <ContactRow
                icon={<Globe className="size-4" />}
                label="Corporate Site"
                value="https://emiratessmile.ae"
                tag="Verified Domain"
                href="https://emiratessmile.ae"
              />
            </div>
          </div>
        </section>

        {/* 15. BULK ACTION BAR (Floating) */}
        <BulkActionBar
          selectedCount={selectedTableIds.length}
          onClear={() => setSelectedTableIds([])}
          entityName="prospects"
          actions={[
            {
              label: "Enrich Selected",
              variant: "primary",
              icon: <Zap className="size-3.5" />,
              onClick: () => alert(`Enriching ${selectedTableIds.length} prospects`),
            },
            {
              label: "Export CSV",
              variant: "secondary",
              icon: <Download className="size-3.5" />,
              onClick: () => alert(`Exporting ${selectedTableIds.length} prospects`),
            },
            {
              label: "Delete",
              variant: "destructive",
              icon: <Trash2 className="size-3.5" />,
              onClick: () => setSelectedTableIds([]),
            },
          ]}
        />
      </div>
    </div>
  )
}
