import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position  : 'absolute', 
    bottom: 20, 
    left : 20, 
    right: 20,
    backgroundColor: '#E5E4E2',
    borderRadius: 15,
    height: 50,
    justifyContent: 'space-evenly'
  },

  button: {
    alignItems: 'center', 
    justifyContent: 'center', 
    top: 0, 
    marginHorizontal: 30,
  },

  middleIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    marginHorizontal: 30,
  },
});

export default styles;
