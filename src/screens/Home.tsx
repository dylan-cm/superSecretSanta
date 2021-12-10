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
    getEvents().then((_events) => {
      setEvents(_events);
    });
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
          <Text style={styles.logo}>Super Secret Santa</Text>
        </View>
        {events.map((event, i) => {
          const rcptId = event.people.find(
            (item) => item.id === event.adminId
          )?.rcpt;
          const rcptName = event.people.find(
            (item) => item.id === rcptId
          )?.name;
          return (
            <Card
              people={event.people.length}
              drawDate={event.drawDate}
              title={event.title}
              onPress={() => navigation.push("Details", { event })}
              rcpt={rcptName}
              key={event.title + i}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

interface CardProps {
  onPress: () => void;
  drawDate?: Date;
  title: string;
  people: number;
  rcpt?: string;
}
const Card = ({ onPress, drawDate, title, people, rcpt }: CardProps) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return (
    <View style={styles.cardsContainer}>
      <TouchableHighlight
        style={[styles.cardWrapper, styles.shadow9]}
        onPress={() => onPress()}
        underlayColor={"#521717"}
      >
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.h2}>{title}</Text>
            <View style={styles.pill}>
              <Text style={styles.pplNum}>{`${people} 🎅`}</Text>
            </View>
          </View>

          {!!rcpt &&
          (!drawDate || new Date(drawDate) <= new Date(Date.now())) ? (
            <>
              <Text style={styles.h3}>You've drawn</Text>
              <Text style={styles.h1}>{`${rcpt} !!!`}</Text>
            </>
          ) : !!drawDate ? (
            <>
              <Text style={styles.h3}>Names will be drawn on</Text>
              <Text style={styles.h1}>
                {drawDate.toLocaleDateString(undefined, options)}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.h3}>Names will be drawn soon.</Text>
            </>
          )}
        </View>
      </TouchableHighlight>
    </View>
  );
};

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
  logo: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  h1: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  h2: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  h3: {
    color: "#ffffff",
    fontSize: 16,
  },
  pill: {
    backgroundColor: "#b2ffd0",
    borderRadius: 16,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    height: 28,
  },
  pplNum: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
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
    alignItems: "stretch",
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
