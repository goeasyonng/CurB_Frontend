import styles from "./SignUp.module.scss";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { SignUpData, DefaultSignUpData } from "../../../interface/Interface";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Radio,
  RadioGroup,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { send_message } from "../../../api/axios/phoneAuthentication";
import { useMutation } from "react-query";
import { signUp } from "api/axios/axiosSetting";
import useSignUpGroup from "./Hook/useSignUpGroup";

const SignUpForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<SignUpData>();

  /**링크 네비게이트 */
  const navigate = useNavigate();
  const toast = useToast();
  const { group } = useSignUpGroup();

  /**회원가입 form 제출시 */

  const { mutate: signUpHandler } = useMutation(
    (signUpData: any) => signUp(signUpData),
    {
      onError: (error: any) => {
        const detail_error = Object.values(error.response.data);
        toast({
          title: "회원가입 실패",
          description: `${detail_error[0]}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  const onSubmit = (data: SignUpData) => {
    const newSignUpData: DefaultSignUpData = {
      username: data.username,
      name: data.name,
      password: data.password,
      phone_number: data.phone_number,
      email: data.email,
      gender: data.gender,
      group: 1,
      is_coach: false,
    };
    console.log(newSignUpData);
    signUpHandler(newSignUpData);
  };

  return (
    <>
      <div className={styles.signUp}>
        <img
          className={styles.signUpImg}
          alt=""
          src="https://velog.velcdn.com/images/view_coding/post/6e4d7220-8bc8-4e88-9d4b-f3dd9e09b523/image.png"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.typeDiv}>
            <label htmlFor="username">ID</label>
            <Input
              id="username"
              placeholder="Id를 입력하세요."
              {...register("username", {
                required: {
                  value: true,
                  message: "필수 정보입니다.",
                },
                maxLength: {
                  value: 15,
                  message: "15자까지 입력가능합니다.",
                },
                minLength: {
                  value: 3,
                  message: "2자 이상 입력하세요.",
                },
              })}
            />
            {errors.username && <p>{errors.username.message}</p>}
          </div>

          <div className={styles.typeDiv}>
            <label htmlFor="password">비밀번호</label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호"
              autoComplete="off"
              {...register("password", {
                required: {
                  value: true,
                  message: "필수 정보입니다.",
                },
                minLength: {
                  value: 8,
                  message: "8자 이상 입력하세요.",
                },
                maxLength: {
                  value: 16,
                  message: "16자까지 입력가능합니다.",
                },
                pattern: {
                  value:
                    // eslint-disable-next-line
                    /^[A-Za-z0-9`~!@#\$%\^&\*\(\)\{\}\[\]\-_=\+\\|;:'"<>,\./\?]{8,20}$/,
                  // eslint-disable-next-line

                  message: "특수문자 1개 이상 넣어주세요.",
                },
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <div className={styles.typeDiv}>
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder="비밀번호 확인"
              autoComplete="off"
              {...register("passwordConfirm", {
                required: {
                  value: true,
                  message: "필수 정보입니다.",
                },
                validate: {
                  check: (val) => {
                    if (getValues("password") !== val) {
                      return "비밀번호가 일치하지 않습니다.";
                    }
                  },
                },
              })}
            />
            {errors.passwordConfirm && <p>{errors.passwordConfirm.message}</p>}
          </div>

          <div className={styles.typeDiv}>
            <label htmlFor="name">성명</label>
            <Input
              id="name"
              placeholder="이름을 입력하세요"
              {...register("name", {
                required: {
                  value: true,
                  message: "필수 정보입니다.",
                },
                maxLength: {
                  value: 10,
                  message: "20자까지 입력 가능합니다.",
                },
                pattern: {
                  value: /^[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/,
                  message:
                    "한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)",
                },
              })}
            />
            {errors.name && <p>{errors.name.message}</p>}
          </div>
          <div className={styles.typeDiv}>
            <label htmlFor="number">전화번호</label>
            <InputGroup>
              <InputLeftAddon
                pointerEvents="none"
                children={<FontAwesomeIcon icon={faPhone} />}
                height="50px"
              />
              <Input
                id="number"
                type="number"
                placeholder="전화번호를 입력하세요."
                {...register("phone_number", {
                  required: "필수 정보입니다.(-는 제외하고 입력해주세요).",
                })}
              />
              <Button onClick={() => send_message(getValues("phone_number"))}>
                인증하기
              </Button>
            </InputGroup>
            {errors?.phone_number && <p>{errors.phone_number?.message}</p>}
          </div>

          <div className={styles.typeDiv}>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              placeholder="이메일을 입력하세요"
              {...register("email", {
                required: "필수 정보입니다.",
                pattern: {
                  // eslint-disable-next-line
                  value:
                    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
                  message: "이메일 형식에 맞지 않습니다.",
                },
                maxLength: {
                  value: 40,
                  message: "40자까지 입력가능합니다.",
                },
              })}
            />
            {errors?.email && <p>{errors.email.message}</p>}
          </div>

          <div className={styles.typeDiv}>
            <label htmlFor="group">부트캠프</label>
            <Select
              id="group"
              height="50px"
              placeholder="부트캠프를 선택해주세요"
              {...register("group", {
                required: "필수 정보입니다.",
              })}
            >
              {group?.map((data: any) => {
                return (
                  <option key={data.pk} value={data.pk}>
                    {data.name}
                  </option>
                );
              })}
            </Select>
            {errors?.group && <p>{errors.group?.message}</p>}
          </div>
          <Box width="87%">
            <Box display="flex" justifyContent="center">
              <RadioGroup>
                <Stack spacing={5} direction="row">
                  <Radio
                    colorScheme="twitter"
                    value="male"
                    {...register("gender", {
                      required: "성별을 입력해주세요.",
                    })}
                  >
                    남
                  </Radio>
                  <Radio
                    colorScheme="red"
                    value="female"
                    {...register("gender", {
                      required: "성별을 입력해주세요.",
                    })}
                  >
                    여
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
            {errors?.gender && (
              <p className={styles.error}>{errors.gender?.message}</p>
            )}
          </Box>
          <div className={styles.buttonDiv}>
            <button
              type="button"
              onClick={() => {
                navigate(-1);
              }}
            >
              이전
            </button>

            <button>회원가입</button>
          </div>
        </form>
      </div>
    </>
  );
};
export default SignUpForm;
