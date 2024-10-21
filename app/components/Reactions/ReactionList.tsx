import { observer } from "mobx-react";
import React from "react";
import Comment from "~/models/Comment";
import useHover from "~/hooks/useHover";
import Logger from "~/utils/Logger";
import Flex from "../Flex";
import Reaction from "./Reaction";

type Props = {
  /** Model for which to show the reactions. */
  model: Comment;
  /** Callback when the user intends to add a reaction. */
  onAddReaction: (emoji: string) => Promise<void>;
  /** Callback when the user intends to remove a reaction. */
  onRemoveReaction: (emoji: string) => Promise<void>;
  /** classname generated by styled-components. */
  className?: string;
};

const ReactionList: React.FC<Props> = ({
  model,
  onAddReaction,
  onRemoveReaction,
  className,
}) => {
  const listRef = React.useRef<HTMLDivElement>(null);
  const { reactedUsers } = model;

  const hovered = useHover({
    ref: listRef,
    duration: 250,
  });

  React.useEffect(() => {
    const loadReactedUsersData = async () => {
      try {
        await model.loadReactedUsersData();
      } catch (err) {
        Logger.warn("Could not prefetch reaction data");
      }
    };

    if (hovered) {
      void loadReactedUsersData();
    }
  }, [hovered, model]);

  return (
    <Flex ref={listRef} className={className} align="center" gap={6} wrap>
      {model.reactions.map((reaction) => (
        <Reaction
          key={reaction.emoji}
          reaction={reaction}
          reactedUsers={reactedUsers?.get(reaction.emoji) ?? []}
          disabled={model.isResolved}
          onAddReaction={onAddReaction}
          onRemoveReaction={onRemoveReaction}
        />
      ))}
    </Flex>
  );
};

export default observer(ReactionList);