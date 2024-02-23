import {
  Input as NativeBaseInput,
  IInputProps,
  FormControl,
} from 'native-base';

type Props = IInputProps & {
  errorMessage?: string | null;
};

export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
  const isInputInvalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={isInputInvalid}>
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>

      <NativeBaseInput
        bgColor="gray.700"
        h={14}
        px={4}
        borderWidth={0}
        fontSize="md"
        color="white"
        fontFamily="body"
        mb={4}
        placeholderTextColor="gray.300"
        isInvalid={isInputInvalid}
        _invalid={{
          borderWidth: 1,
          borderColor: 'red.500',
        }}
        _focus={{
          backgroundColor: 'gray.300',
          borderWidth: 1,
          borderColor: 'green.500',
        }}
        {...rest}
      />
    </FormControl>
  );
}
