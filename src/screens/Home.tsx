import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackScreenProps } from "../types";
import { getEvents } from "../firebase";
import { SSEvent } from "../types";

const Home = ({ navigation }: RootStackScreenProps<"Home">) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [events, setEvents] = useState<SSEvent[]>([]);

  useEffect(() => {
    getEvents().then((events: SSEvent[]) => setEvents(events));
    return;
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.layout}
        stickyHeaderIndices={[0]}
        onScroll={(event) => setScrollOffset(event.nativeEvent.contentOffset.y)}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, scrollOffset !== 0 && styles.shadow9]}>
          <Text style={styles.h1}>Super Secret Santa</Text>
        </View>
        {events.map((event) => (
          <Card {...event} onPress={(id) => console.log(id)} key={event.id} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

interface CardProps {
  onPress: (id: string) => void;
  drawDate: Date;
  title: string;
  people: string[];
  id: string;
}
const Card = ({ id, onPress, drawDate, title, people }: CardProps) => {
  const calculateTimeLeft = () => {
    const difference = +drawDate - +new Date();
    let timeLeft;

    if (difference > 0) {
      timeLeft = {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  return (
    <View style={styles.cardsContainer}>
      <TouchableHighlight
        style={[styles.cardWrapper, styles.shadow9]}
        onPress={() => onPress(id)}
        underlayColor={"#521717"}
      >
        <View style={styles.card}>
          <Text style={styles.h2}>{title}</Text>

          {!timeLeft ? (
            <Text>Your Giftee is Bing</Text>
          ) : (
            <>
              <Text style={styles.h3}>Drawing in: </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <BigLittleText top={timeLeft.d.toString()} btm={"DAYS"} />
                <BigLittleText top={timeLeft.h.toString()} btm={"HOURS"} />
                <BigLittleText top={timeLeft.m.toString()} btm={"MINUTES"} />
                <BigLittleText top={timeLeft.s.toString()} btm={"SECONDS"} />
              </View>
            </>
          )}

          <Text
            style={styles.link}
          >{`${people.length}\tSecret Santas \t >`}</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const BigLittleText = ({ top, btm }: { top: string; btm: string }) => (
  <View
    style={{
      alignItems: "center",
      marginHorizontal: 4,
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontSize: 18,
      }}
    >
      {top}
    </Text>
    <Text
      style={{
        color: "#fff",
        fontSize: 8,
      }}
    >
      {btm}
    </Text>
  </View>
);

export default Home;

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#ff4141",
  },
  layout: {
    minHeight: "100%",
  },
  header: {
    backgroundColor: "#ff4141",
  },
  cardsContainer: {
    backgroundColor: "#ff4141",
    paddingBottom: 16,
  },
  h1: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  h2: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  h3: {
    color: "#ffffff",
    fontSize: 12,
    marginBottom: 4,
  },
  h4: {
    color: "#aaa9a9",
    fontSize: 16,
    marginBottom: 16,
  },
  link: {
    color: "#b0ffc6",
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "bold",
  },
  cardWrapper: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    paddingBottom: 16,
    backgroundColor: "#882a2a",
    borderTopColor: "#d37e7e",
    borderTopWidth: 0.5,
    borderBottomColor: "#461212",
    borderBottomWidth: 0.5,
    overflow: "hidden",
  },
  card: {
    alignItems: "flex-start",
  },
  shadow9: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  shadow1: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
});
