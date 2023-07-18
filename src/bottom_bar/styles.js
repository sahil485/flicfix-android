import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position  : 'absolute', 
    bottom: 20, 
    left : 20, 
    right: 20, 
    elevation: 0, 
    backgroundColor: '#E5E4E2',
    borderRadius: 15,
    height: 50,
    shadowColor: '#9e9e9e',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    marginHorizontal: 30,
  },
});

export default styles;
