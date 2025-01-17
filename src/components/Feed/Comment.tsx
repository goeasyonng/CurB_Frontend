import { Flex } from "@chakra-ui/react";
import "moment/locale/ko";
import { useQueryClient } from "react-query";
import useComment from "../../pages/main/hook/useComment";
import { Querykey } from "api/react-query/QueryKey";
import CommentCard from "components/Card/CommentCard";
import ReCommentCard from "components/Card/ReCommentCard";
import { CommentType } from "../../pages/main/interface/type";

interface CommentProps {
  feedId: string | undefined;
}

function Comment({ feedId }: CommentProps) {
  const { feedComment, refetch: refetchComment } = useComment(feedId);

  const queryClient = useQueryClient();

  const successRefetch = {
    onSuccess: () => {
      refetchComment();
    },
  };

  const successPost = () => {
    queryClient.invalidateQueries([Querykey.feedData]);
    queryClient.invalidateQueries([Querykey.feedDetail, feedId]);
    refetchComment();
  };

  return (
    <>
      {feedComment?.map((comment: CommentType, index) => {
        return (
          <Flex key={index} width="100%" flexDir="column">
            <CommentCard
              key={index}
              comment={comment}
              successRefetch={successRefetch}
              successPost={successPost}
            />

            {comment.recomment?.map((recomment, index) => (
              <ReCommentCard
                key={index}
                recomment={recomment}
                index={index}
                successRefetch={successRefetch}
                successPost={successPost}
              />
            ))}
          </Flex>
        );
      })}
    </>
  );
}

export default Comment;
