import './Navbar.scss';
import { AppBar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

interface NavItem {
  label: string;
  route: string;
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    route: '/'
  },
  {
    label: 'Organize',
    route: '/organize'
  },
  {
    label: 'All Players',
    route: '/players'
  }
];

const Navbar = () => {

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  return (
    <>
      <AppBar component="nav" elevation={0}>
        <Toolbar sx={{ height: 64}}>
          <Box className="logo">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              // edge="start"
              onClick={toggleDrawer}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
            >
              Dimer
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((navItem) => (
              <Button key={`navbar-item-${navItem.label}`} sx={{ color: '#fff' }}>
                {navItem.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
              Dimer
            </Typography>
            <Divider />
            <List>
              {navItems.map((navItem) => (
                <ListItem key={`navbar-drawer-item-${navItem.label}`} disablePadding>
                  <ListItemButton sx={{ textAlign: 'center' }}>
                    <ListItemText primary={navItem.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </nav>
    </>
  );
};

export { Navbar };