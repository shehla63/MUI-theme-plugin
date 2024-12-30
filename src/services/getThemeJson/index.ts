import getAllModesColorSchemes from "../getAllModesColorSchemes";
import getBreakpoints from "../getBreakpoints";
import getButtonGroups from "../getButtonGroups";
import getButtons from "../getButtons";
import getColors from "../getColors";
import getShapes from "../getShapes";
import getSpacing from "../getSpacing";
import getTextStyles from "../getTextStyles";
import getChips from "../getChips";
import getRadio from "../getRadio";
import getInputLabels from "../getInputLabels";
import getCheckbox from "../getCheckbox";
import getFormLabels from "../getFormLabels";
import getFormHelperText from "../getFormHelperText";
import getTooltip from "../getTooltip";
import getTextfield from "../getTextfield";
import getTable from "../getTable";
import getBottomNavigationAction from "../getBottomNavigationAction";
import getDialog from "../getDialog";
import getList from "../getList";
import getSpeedDial from "../getSpeedDial";
import getLink from "../getLink";
import getMenu from "../getMenu";
import getPaper from "../getPaper";
import getPaginationItem from "../getPaginationItem";
import getPagination from "../getPagination";
import getAlert from "../getAlert";
import getDivider from "../getDivider";
import getTextFieldLabels from "../getTextFieldLabels";
import getToolbar from "../getToolbar";
import getIconButton from "../getIconButton";
import getAppBar from "../getAppbar";
import getAvatar from "../getAvatar";
import getTabs from "../getTabs";
import getSkeleton from "../getSkeleton";
import getAccordion from "../getAccordion";
import getBadges from "../getBadge";
import getToggleButton from "../getToggleButton";
import getToggleButtonGroup from "../getToggleButtonGroup";
import getSlider from "../getSlider";
import getCharts from "../getCharts";
import getBreadcrumbs from "../getBreadcrumbs";
import getStep from "../getStep";
import getStepper from "../getStepper";
import getMobileStepper from "../getMobileStepper";
import getSnackbar from "../getSnackbar";
import getRating from "../getRating";
import getBackdrop from "../getBackdrop";
import getImageListItemBar from "../getImageList";
import getIcons from "../getIcons";
import getPopover from "../getPopover";

export default function getThemeJson() {
  const colors = getColors();
  const typography = getTextStyles();
  const breakpoints = getBreakpoints();
  const spacing = getSpacing();
  const shape = getShapes();
  const colorSchemes = getAllModesColorSchemes();
  const buttons = getButtons();
  const buttonGroups = getButtonGroups();
  const chips = getChips();
  const radio = getRadio();
  const checkbox = getCheckbox();
  const inputLabels = getInputLabels();
  const formLabels = getFormLabels();
  const formHelperText = getFormHelperText();
  const tooltip = getTooltip();
  const table = getTable();
  const bottomNavigationAction = getBottomNavigationAction();
  const dialog = getDialog();
  const list = getList();
  const speedDial = getSpeedDial();
  const link = getLink();
  const menu = getMenu();
  const paper = getPaper();
  const pagination = getPagination();
  const paginationItem = getPaginationItem();
  const alert = getAlert();
  const divider = getDivider();
  const textfield = getTextfield();
  const textFieldLabels = getTextFieldLabels();
  const toolbar = getToolbar();
  const iconButton = getIconButton();
  const appbar = getAppBar();
  const avatar = getAvatar();
  const tabs = getTabs();
  const skeleton = getSkeleton();
  const accordion = getAccordion();
  const badge = getBadges();
  const toggleButton = getToggleButton();
  const toggleButtonGroup = getToggleButtonGroup();
  const slider = getSlider();
  const charts = getCharts();
  const breadcrumbs = getBreadcrumbs();
  const stepper = getStepper();
  const step = getStep();
  const mobileStepper = getMobileStepper();
  const snackbar = getSnackbar();
  const rating = getRating();
  const backdrop = getBackdrop();
  const imageListItemBar = getImageListItemBar();
  const icons = getIcons();
  const popover = getPopover();

  const theme = {
    colorSchemes: colorSchemes,
    "material/colors": colors,
    textStyles: typography,
    breakpoints,
    spacing,
    shape,
    components: {
      ...buttons,
      ...buttonGroups,
      ...chips,
      ...checkbox,
      ...radio,
      ...inputLabels,
      ...formLabels,
      ...formHelperText,
      ...tooltip,
      ...table,
      ...bottomNavigationAction,
      ...dialog,
      ...list,
      ...speedDial,
      ...link,
      ...menu,
      ...paper,
      ...pagination,
      ...paginationItem,
      ...alert,
      ...divider,
      ...textfield,
      ...textFieldLabels,
      ...toolbar,
      ...iconButton,
      ...appbar,
      ...avatar,
      ...tabs,
      ...skeleton,
      ...accordion,
      ...badge,
      ...toggleButton,
      ...toggleButtonGroup,
      ...slider,
      ...charts,
      ...breadcrumbs,
      ...stepper,
      ...step,
      ...mobileStepper,
      ...snackbar,
      ...rating,
      ...backdrop,
      ...imageListItemBar,
      ...icons,
      ...popover,
    },
  };

  console.log("Done...");

  return JSON.stringify(theme, null, 2);
}
