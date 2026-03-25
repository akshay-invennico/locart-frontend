import {
  HeaderField,
  SubheaderField,
  TextBlockField,
  DividerField,
  FilterByField,
} from "./StaticFields";
import ToggleField from "./ToggleField";
import {
  TextField,
  ReadOnlyField,
  InputPairField,
  TextareaField,
  FileField,
  NumberRangeField,
} from "./InputFields";
import SelectField from "./SelectField";
import {
  CheckboxGroupField,
  SelectCheckboxField,
  SelectCheckboxSingleField,
} from "./CheckboxFields";
import {
  DateRangeField,
  DateField,
  TimeDurationField,
  TimeField,
  TimeRangeField,
} from "./DateTimeFields";
import RadioWithConditionalDropdown from "./RadioWithConditionalDropdown";
import ExistingClientSelect from "./ExistingClientSelect";
import InputWithSelectCheckboxDropdown from "./InputWithSelectCheckboxDropdown";
import ThumbnailListField from "./ThumbnailListField";

const fieldRegistry = {
  header: HeaderField,
  subheader: SubheaderField,
  textBlock: TextBlockField,
  divider: DividerField,
  filterBy: FilterByField,
  toggle: ToggleField,
  input: TextField,
  inputReadOnly: ReadOnlyField,
  inputPair: InputPairField,
  textarea: TextareaField,
  file: FileField,
  numberRange: NumberRangeField,
  select: SelectField,
  checkboxGroup: CheckboxGroupField,
  selectCheckbox: SelectCheckboxField,
  selectCheckboxSingle: SelectCheckboxSingleField,
  dateRange: DateRangeField,
  date: DateField,
  timeDuration: TimeDurationField,
  time: TimeField,
  timeRange: TimeRangeField,
  radioWithConditionalDropdown: RadioWithConditionalDropdown,
  existingClientSelect: ExistingClientSelect,
  inputWithSelectCheckboxDropdown: InputWithSelectCheckboxDropdown,
  thumbnailList: ThumbnailListField,
};

export default fieldRegistry;
