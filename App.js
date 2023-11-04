import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';

export default function App() {
  const [images, setImages] = useState([
    {id: 1, imgUrl: require('./assets/1.png')},
    {id: 2, imgUrl: require('./assets/2.png')},
    {id: 3, imgUrl: require('./assets/3.png')}
  ]);

function swipeOff(cardId){
  setImages(prevImages => prevImages.filter(img => img.id !== cardId))
}

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <View style={styles.container}>
            { images.map((image) => (
          <MyCard key={image.id} image={image} onSwipeOff={swipeOff}/>
            ))}

        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}

const MyCard = ({image, onSwipeOff}) => {

  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      console.log("Start, der sker noget " + translateX.value);
      context.translateX = translateX.value;
  
    },
    onActive: (event, context) => {
      translateX.value = context.translateX + event.translationX;
      rotate.value = -translateX.value/25
    
    },
    onEnd: () => {
      if (Math.abs(translateX.value) > 100) {
        translateX.value = withSpring(500) // rykker ud til højre
        runOnJS(onSwipeOff)(image.id)

      }else {
        translateX.value = withSpring(0)
        rotate.value = withSpring(0)

      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: rotate.value + 'deg' }
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
    <Animated.View style={animatedStyle}>
    <Image source={image.imgUrl} style={styles.imgStyle}/>
    </Animated.View>
        </PanGestureHandler>
  )
}

const styles = StyleSheet.create({
  imgStyle:{
    width: 200,
    height: 200,
  },
  rootView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
