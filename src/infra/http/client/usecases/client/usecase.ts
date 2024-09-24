export interface UseCase<InputDto, outputDto> {
  execute(input: InputDto): Promise<outputDto>;
}
