import {
  SafeArea,
  TopBar,
  SearchField,
  SearchText,
  ActionButton,
  BottomNav,
  NavItem,
} from './styles';

type CreateProps = {
  onNavigate: (screen: 'home' | 'create') => void;
};

export function Create({ onNavigate }: CreateProps) {
  return (
    <SafeArea>
      {/* TOP BAR */}
      <TopBar>
        <SearchField>
          {/* SEARCH ICON */}
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.5 }}
          >
            <circle cx="8" cy="8" r="6" />
            <line x1="13" y1="13" x2="17" y2="17" />
          </svg>

          <SearchText>Поиск вызовов</SearchText>
        </SearchField>

        {/* ACTION BUTTON */}
        <ActionButton>
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="11" y1="4" x2="11" y2="18" />
            <line x1="4" y1="11" x2="18" y2="11" />
          </svg>
        </ActionButton>
      </TopBar>

      {/* BOTTOM NAV */}
      <BottomNav>
        {/* HOME */}
        <NavItem onClick={() => onNavigate('home')}>
          <svg width="24" height="24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
          </svg>
        </NavItem>

        {/* CREATE — ACTIVE */}
        <NavItem $active>
          <svg width="24" height="24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </NavItem>

        {/* SIGNAL */}
        <NavItem>
          <svg width="24" height="24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round">
            <line x1="6" y1="18" x2="6" y2="14" />
            <line x1="12" y1="18" x2="12" y2="10" />
            <line x1="18" y1="18" x2="18" y2="6" />
          </svg>
        </NavItem>

        {/* PROFILE */}
        <NavItem>
          <svg width="24" height="24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          </svg>
        </NavItem>
      </BottomNav>
    </SafeArea>
  );
}
