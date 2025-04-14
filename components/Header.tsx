// import React from 'react';
// import { StyleSheet } from 'react-native';
// import { Appbar, Menu, Divider } from 'react-native-paper';
// import { useSelector } from 'react-redux';
// import type { RootState } from '@/lib/store'; // Adjust import path
// import { router } from 'expo-router';
// import { useAppTheme } from '@/app/_layout';
// // Placeholder for UserNav - Implement this separately
// // import UserNav from './UserNav';

// export function Header() {
//     const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
//     const [visible, setVisible] = React.useState(false);

//     const openMenu = () => setVisible(true);
//     const closeMenu = () => setVisible(false);

//     const { colors: { primary, onPrimary } } = useAppTheme(); // Use your theme hook

//     // Navigation functions
//     // const goHome = () => { router.push('/(pubcam)'); closeMenu(); };
//     // const goServices = () => { navigation.navigate('ServicesList' as never); closeMenu(); }; // Adjust route name
//     // const goDashboard = () => { navigation.navigate('ProviderDashboard' as never); closeMenu(); }; // Adjust route name
//     // const goLearn = () => { navigation.navigate('Learn' as never); closeMenu(); }; // Adjust route name
//     // const goAbout = () => { navigation.navigate('About' as never); closeMenu(); }; // Adjust route name
//     // const goLogin = () => { navigation.navigate('Login' as never); closeMenu(); }; // Adjust route name
//     // const goProfile = () => { navigation.navigate('Profile' as never); closeMenu(); } // Adjust route name

//     // Determine user initials or a default icon
//     const getUserInitials = () => {
//         if (user?.name) {
//             return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
//         }
//         return '??'; // Fallback
//     };

//     return (
//         <Appbar.Header
//             style={{ backgroundColor: primary }} // Use theme color
//             // statusBarHeight can be adjusted if needed, but SafeAreaView often handles it
//         >
//             {/* Optional: Drawer Menu Icon if using Drawer Navigation */}
//             {/* <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} color={theme.colors.onPrimary}/> */}

//             {/* App Title */}
//             <Appbar.Content title="PubCam" color={onPrimary} onPress={goHome}/>

//             {/* Actions Menu (Hamburger for main navigation items) */}
//             <Menu
//                 visible={visible}
//                 onDismiss={closeMenu}
//                 anchor={
//                     <Appbar.Action icon="menu" color={theme.colors.onPrimary} onPress={openMenu} />
//                 }>
//                 <Menu.Item onPress={goHome} title="Home" leadingIcon="home" />
//                 <Menu.Item onPress={goServices} title="Services" leadingIcon="magnify"/>
//                 {isAuthenticated && user?.role === 'service-provider' && (
//                     <Menu.Item onPress={goDashboard} title="Dashboard" leadingIcon="view-dashboard"/>
//                 )}
//                 {isAuthenticated && (
//                     <Menu.Item onPress={goLearn} title="Learn" leadingIcon="school"/>
//                 )}
//                 <Menu.Item onPress={goAbout} title="About" leadingIcon="information"/>
//                 <Divider />
//                  {isAuthenticated ? (
//                     <Menu.Item onPress={goProfile} title="Profile" leadingIcon="account-circle"/>
//                  ) : (
//                     <Menu.Item onPress={goLogin} title="Login / Sign Up" leadingIcon="login"/>
//                  )}
//                 {/* Add Logout functionality here if needed */}
//                  {/* {isAuthenticated && <Menu.Item onPress={handleLogout} title="Logout" leadingIcon="logout"/>} */}

//             </Menu>

//              {/* Placeholder for UserNav or direct profile icon */}
//              {/* {isAuthenticated ? (
//                 <Appbar.Action icon="account-circle" onPress={() => navigation.navigate('Profile')} color={theme.colors.onPrimary} />
//                  // Or use Avatar.Text:
//                  // <Avatar.Text size={32} label={getUserInitials()} style={styles.avatar} color={theme.colors.primary} />
//              ) : (
//                 <Appbar.Action icon="login" onPress={() => navigation.navigate('Login')} color={theme.colors.onPrimary} />
//              )} */}

//             {/* Remove LanguageSwitcher or implement RN version */}

//         </Appbar.Header>
//     );
// }

// const styles = StyleSheet.create({
//    avatar: {
//     marginRight: 8,
//     // backgroundColor needs to be set if you want contrast
//     // backgroundColor: '#fff', // Example contrast background
//    }
// });
