import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Person, RootStackParamList } from "../types";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DetailsProps {}

const Details = ({
  route,
}: NativeStackScreenProps<RootStackParamList, "Details">) => {
  const { event } = route.params;
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  // console.log(event); //dev

  const handleDraw = () => {
    const { people } = event;
    const drawn: { from: Person; to: Person }[] = [];

    people.forEach((person) => {
      const pickRand = () => Math.floor(Math.random() * people.length);
      let index = pickRand();

      const isTaken = () =>
        drawn.findIndex((p) => p.to.id === people[index].id) >= 0;
      const toIsFrom = () => person.id === people[index].id;

      while (toIsFrom() || isTaken()) index = pickRand();

      drawn.push({
        from: person,
        to: people[index],
      });
    });
    // console.log(drawn.map((d) => [d.from.id, d.to.id])); //dev
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.layout}
        showsVerticalScrollIndicator={false}
      >
        {!!event.drawDate && (
          <Text style={styles.text}>
            {event.drawDate.toLocaleDateString(undefined, options)}
          </Text>
        )}
        <Text style={styles.text}>
          {`Admin: ${event.people.find((p) => p.id === event.adminId)?.name}`}
        </Text>
        <Text style={styles.text}>Secret Santas:</Text>
        {event.people.map((p, i) => (
          <Text style={styles.text} key={p.name + i}>
            {p.name}
          </Text>
        ))}
        {event.drawn ? (
          <Text>
            Names have been drawn and Secret Santas have been notified!
          </Text>
        ) : (
          <TouchableOpacity
            onPress={() => handleDraw()}
            style={[styles.button, styles.shadow3]}
          >
            <Text style={styles.buttonText}>Draw Names and Send</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#ff4141",
  },
  layout: {
    alignItems: "stretch",
    padding: 16,
    minHeight: "100%",
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontSize: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7bff98",
    borderRadius: 16,
    marginTop: 12,
    borderColor: "#fff",
    borderWidth: 4,
    minWidth: 200,
    overflow: "hidden",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
  shadow3: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});
